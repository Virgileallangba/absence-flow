
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				corporate: {
					blue: {
						50: 'hsl(var(--corporate-blue-50))',
						100: 'hsl(var(--corporate-blue-100))',
						500: 'hsl(var(--corporate-blue-500))',
						600: 'hsl(var(--corporate-blue-600))',
						700: 'hsl(var(--corporate-blue-700))',
					},
					green: {
						50: 'hsl(var(--corporate-green-50))',
						100: 'hsl(var(--corporate-green-100))',
						500: 'hsl(var(--corporate-green-500))',
						600: 'hsl(var(--corporate-green-600))',
					},
					orange: {
						50: 'hsl(var(--corporate-orange-50))',
						100: 'hsl(var(--corporate-orange-100))',
						500: 'hsl(var(--corporate-orange-500))',
						600: 'hsl(var(--corporate-orange-600))',
					},
					gray: {
						50: 'hsl(var(--corporate-gray-50))',
						100: 'hsl(var(--corporate-gray-100))',
						200: 'hsl(var(--corporate-gray-200))',
						300: 'hsl(var(--corporate-gray-300))',
						400: 'hsl(var(--corporate-gray-400))',
						500: 'hsl(var(--corporate-gray-500))',
						600: 'hsl(var(--corporate-gray-600))',
						700: 'hsl(var(--corporate-gray-700))',
						800: 'hsl(var(--corporate-gray-800))',
						900: 'hsl(var(--corporate-gray-900))',
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			boxShadow: {
				'soft': '0 2px 8px 0 rgba(99, 102, 241, 0.05)',
				'medium': '0 4px 12px 0 rgba(99, 102, 241, 0.1)',
				'large': '0 8px 24px 0 rgba(99, 102, 241, 0.15)',
				'glow': '0 0 20px 0 rgba(99, 102, 241, 0.2)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
