import React from "react";

interface TryAgainProps {
    error: string;
}
export default function TryAgain({ error }: TryAgainProps) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center p-8 bg-gray-800 rounded-xl max-w-md">
                <h2 className="text-xl font-bold text-gray-100 mb-4">Error</h2>
                <p className="text-gray-400 mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-purple-600 text-gray-100 rounded-lg hover:bg-purple-500 transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
