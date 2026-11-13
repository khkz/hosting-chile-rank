
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
			padding: '1.25rem',
			screens: {
				'2xl': '1280px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Archivo', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
				display: ['Archivo', 'system-ui', 'sans-serif'],
				// Alias heredados: las clases font-montserrat / font-poppins ya
				// usadas en el sitio pasan a la tipografía del sistema.
				montserrat: ['Archivo', 'system-ui', 'sans-serif'],
				poppins: ['Archivo', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				// Escala tipográfica del sistema (≈ 1.25, Elements of Typographic Style)
				'2xs': ['0.75rem', { lineHeight: '1.1rem' }],
			},
			colors: {
				ink: {
					DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
					2: 'rgb(var(--ink-2) / <alpha-value>)',
					3: 'rgb(var(--ink-3) / <alpha-value>)',
					soft: 'rgb(var(--ink-soft) / <alpha-value>)',
				},
				paper: {
					DEFAULT: 'rgb(var(--paper) / <alpha-value>)',
					deep: 'rgb(var(--paper-deep) / <alpha-value>)',
				},
				rule: 'rgb(var(--rule) / <alpha-value>)',
				brand: {
					DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
					ink: 'rgb(var(--brand-ink) / <alpha-value>)',
					'on-dark': 'rgb(var(--brand-on-dark) / <alpha-value>)',
				},
				signal: {
					measured: 'rgb(var(--signal-measured) / <alpha-value>)',
					'measured-bg': 'rgb(var(--signal-measured-bg) / <alpha-value>)',
					declared: 'rgb(var(--signal-declared) / <alpha-value>)',
					'declared-bg': 'rgb(var(--signal-declared-bg) / <alpha-value>)',
					editorial: 'rgb(var(--signal-editorial) / <alpha-value>)',
					'editorial-bg': 'rgb(var(--signal-editorial-bg) / <alpha-value>)',
				},
				ok: 'rgb(var(--ok) / <alpha-value>)',
				// Alias heredados → tokens del sistema
				'brand-red': {
					DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
					light: 'rgb(var(--brand-on-dark) / <alpha-value>)',
					dark: 'rgb(var(--brand-ink) / <alpha-value>)',
				},
				'warm-cream': 'rgb(var(--paper) / <alpha-value>)',
				'warm-peach': 'rgb(var(--paper-deep) / <alpha-value>)',
				'warm-yellow': 'rgb(var(--signal-declared) / <alpha-value>)',
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
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				},
				'gradient': {
					'0%, 100%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					}
				},
				'marquee': {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-50%)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'glow': {
					'0%, 100%': { 
						boxShadow: '0 0 5px hsl(var(--primary) / 0.5)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 20px hsl(var(--primary) / 0.8), 0 0 40px hsl(var(--primary) / 0.4)',
						transform: 'scale(1.02)'
					}
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-in-up': 'fade-in-up 0.5s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'shimmer': 'shimmer 2s linear infinite',
				'gradient': 'gradient 3s ease infinite',
				'marquee': 'marquee 20s linear infinite',
				'float': 'float 3s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
