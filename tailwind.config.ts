
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
			screens: {
				'xs': '475px',
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
				// University Theme Colors - Based on Official Logo
				'university-blue': {
					DEFAULT: 'hsl(var(--university-blue))',
					light: 'hsl(var(--university-blue-light))',
					dark: 'hsl(var(--university-blue-dark))'
				},
				'university-red': {
					DEFAULT: 'hsl(var(--university-red))'
				},
				'university-gold': {
					DEFAULT: 'hsl(var(--university-gold))',
					light: 'hsl(var(--university-gold-light))'
				},
				'academic-gray': {
					DEFAULT: 'hsl(var(--academic-gray))',
					light: 'hsl(var(--academic-gray-light))'
				},
				// Aylol University College Primary Identity Colors
				'aylol-primary': {
					DEFAULT: 'hsl(var(--aylol-primary))',
					light: 'hsl(var(--aylol-primary-light))',
					dark: 'hsl(var(--aylol-primary-dark))'
				},
				'aylol-secondary': {
					DEFAULT: 'hsl(var(--aylol-secondary))',
					light: 'hsl(var(--aylol-secondary-light))'
				},
				'aylol-accent': {
					DEFAULT: 'hsl(var(--aylol-accent))'
				},
				'aylol-muted': {
					DEFAULT: 'hsl(var(--aylol-muted))',
					light: 'hsl(var(--aylol-muted-light))'
				},
				// Administrative Panel Colors
				'admin-bg': 'hsl(var(--admin-bg))',
				'admin-sidebar': 'hsl(var(--admin-sidebar))',
				'admin-header': 'hsl(var(--admin-header))',
				'admin-accent': 'hsl(var(--admin-accent))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'medium': 'var(--shadow-medium)',
				'large': 'var(--shadow-large)',
				'university': 'var(--shadow-university)'
			},
			backgroundImage: {
				'hero-gradient': 'var(--hero-gradient)',
				'card-gradient': 'var(--card-gradient)',
				'accent-gradient': 'var(--accent-gradient)',
				'mobile-auth-bg': 'var(--mobile-auth-bg)',
				'mobile-auth-card': 'var(--mobile-auth-card)',
				'mobile-auth-button': 'var(--mobile-auth-button)',
				'mobile-auth-button-hover': 'var(--mobile-auth-button-hover)'
			},
			fontFamily: {
				'cairo': ['Cairo', 'Tajawal', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
				'tajawal': ['Tajawal', 'Cairo', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
				'arabic': ['Cairo', 'Tajawal', 'Noto Sans Arabic', 'Arabic UI Display', 'system-ui', 'sans-serif'],
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
				'fadeInUp': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200px 0'
					},
					'100%': {
						backgroundPosition: 'calc(200px + 100%) 0'
					}
				},
				'breathe': {
					'0%, 100%': {
						transform: 'scale(1)'
					},
					'50%': {
						transform: 'scale(1.05)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fadeInUp': 'fadeInUp 0.6s ease-out forwards',
				'shimmer': 'shimmer 2s linear infinite',
				'breathe': 'breathe 3s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
