export type NavigationSubLink = {
	text: string;
	href: string;
	rel?: string;
};

export type NavigationLinkHeader = {
	header: string;
	base?: string;
	links: Array<NavigationSubLink>;
};

export type NavigationLink = {
	text: string;
	href?: string;
	rel?: string;
	headers?: Array<NavigationLinkHeader>;
};
