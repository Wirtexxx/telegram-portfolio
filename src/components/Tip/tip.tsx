<Link href="/ton-connect">
    <div className="relative group overflow-hidden rounded-2xl hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-black/50 backdrop-blur-md -z-10" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:30px_30px] opacity-5 -z-20" />

        <Cell
            before={
                <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm">
                    <Image
                        src="/ton.svg"
                        width={32}
                        height={32}
                        alt="TON Logo"
                        className="drop-shadow-lg"
                    />
                </div>
            }
            subtitle={
                <span className="text-gray-300/70">
                    Connect your TON wallet
                </span>
            }
            after={
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 group-hover:text-white transition"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            }
            className="bg-transparent hover:bg-white/5 transition-colors"
        >
            <span className="text-white font-medium tracking-wide">
                TON Connect
            </span>
        </Cell>
    </div>
</Link>;
