import './globals.css';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {ClerkProvider} from '@clerk/nextjs';
import Providers from '@/components/Providers';
import {Toaster} from 'react-hot-toast';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
	title: 'ChatPDF',
	description:
		'Yet another Data as a Service App for all your PDF needs.😉',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<Providers>
				<html lang='en'>
					<body className={inter.className}>
						{children}
						<Toaster />
					</body>
				</html>
			</Providers>
		</ClerkProvider>
	);
}
