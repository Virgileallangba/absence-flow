import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Camera } from "lucide-react";

interface AvatarUploaderProps {
  userId: string;
  currentAvatarUrl: string | null;
  fullName: string;
  onAvatarUpdate: (newUrl: string) => void;
}

const AvatarUploader = ({ userId, currentAvatarUrl, fullName, onAvatarUpdate }: AvatarUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image valide.",
        variant: "destructive",
      });
      return;
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // 1. Upload sur Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${userId}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // 2. Récupérer l'URL publique
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // 3. Mettre à jour le profil
      const { error: updateError } = await supabase
        .from('employees')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      // 4. Mettre à jour l'UI
      onAvatarUpdate(publicUrl);
      
      toast({
        title: "Succès",
        description: "Votre photo de profil a été mise à jour.",
      });
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de votre photo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={currentAvatarUrl || "/placeholder.svg"} alt={fullName} />
          <AvatarFallback>{fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 p-1.5 bg-corporate-blue-600 text-white rounded-full cursor-pointer hover:bg-corporate-blue-700 transition-colors"
        >
          <Camera className="h-4 w-4" />
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      {uploading && (
        <p className="text-sm text-corporate-gray-500">Mise à jour en cours...</p>
      )}
    </div>
  );
};

export default AvatarUploader; 