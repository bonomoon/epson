import { SocketProvider } from "@components/providers/socket-provider";

export default function ScoreLayout({ children, modal }) {
    return (
        <SocketProvider>
            {children}
        </SocketProvider>
    )
}