import Card from "@/components/ui/card";
import { LinkPreview } from "@/components/ui/link-preview";
import { client } from "@/sanity/lib/client";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Author {
  _id: number;
  name: string;
}

interface BlogProps {
  _id: string;
  _createdAt: string;
  views: number;
  author: Author;
  description: string;
  image: string;
  category: string;
  title: string;
  pitch: string;
}

const BLOGS_QUERY = `*[
  _type == "blog"
  && defined(slug.current)
]|order(publishedAt desc)[0...6]{title, slug, author, view, description, category, image, pitch}`;

const options = { next: { revalidate: 30 } };

export default async function Home() {
  const blogs = await client.fetch<BlogProps[]>(BLOGS_QUERY, {}, options);

  return (
    <div className="px-5">
      <div className="container my-10 flex w-full grid-cols-[300px,1fr] flex-col-reverse gap-5 lg:grid">
        <Sidebar />
        <div className="font-medium text-text dark:text-text-dark">
          <p className="text-[24px] sm:text-[30px] lg:text-[46px]">
            Welcome to my Directory
            <span className="inline-block">
              <Image
                alt=""
                src="https://avatars.githubusercontent.com/axyl1410"
                width={30}
                height={30}
                className="mx-2.5 h-[20px] w-[20px] rounded-full md:h-[30px] md:w-[30px]"
              />
            </span>
            I&apos;m Alex and here I document our latest explorations.
          </p>

          <div className="mb-[100px] mt-8 flex gap-2 text-sm">
            <div className="flex w-fit items-center gap-1 rounded-md bg-linkShade p-2 text-sm text-link dark:bg-nav-dark">
              <p>Gallery</p>
              <ArrowUpRight size={16} />
            </div>
            <LinkPreview url="https://nguyentruonggiang.id.vn">
              <div className="flex w-fit items-center rounded-md bg-linkShade p-2 text-sm text-link dark:bg-nav-dark">
                <p>About me</p>
                <ArrowUpRight size={16} />
              </div>
            </LinkPreview>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between">
              <p className="text-xl font-medium md:text-2xl">
                Recent Tutorials
              </p>
              <p className="text-link hover:underline">See all</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, _id) => (
                <Card key={_id} {...blog} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function Sidebar() {
    return (
      <div className="top-[106px] z-10 flex h-[calc(100vh-106px)] w-[300px] flex-col gap-4 lg:sticky">
        {[
          {
            title: "Getting Started",
            children: [
              {
                title: "Introduction",
                link: "/",
              },
            ],
          },
        ].map((section) => (
          <details key={section.title} open>
            <summary className="cursor-pointer font-semibold">
              {section.title}
            </summary>
            {section.children.map((child) => (
              <Link key={child.link} href={child.link}>
                <p className="mt-2 w-fit rounded-md bg-linkShade p-2 text-sm text-link dark:bg-nav-dark">
                  {child.title}
                </p>
              </Link>
            ))}
          </details>
        ))}
      </div>
    );
  }
}
