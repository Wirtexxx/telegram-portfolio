export type InfoData = {
    _id: string;
    name: string;
    username: string;
    description: Record<string, string>;
    status: string;
    avatar: string;
    links: {
        telegram_channel: string;
        website: string;
        github: string;
    };
};
export type GalleryItem = {
    slug: string;
    title: Record<string, string>;
    description: Record<string, string>;
    color: string;
    img: string;
    link: string;
    price: Record<string, string>;
    review: Record<string, string>;
};
