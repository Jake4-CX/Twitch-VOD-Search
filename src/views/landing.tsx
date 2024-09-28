import { searchTwitchVods } from "@/api/twitch";
import SettingsModal from "@/components/global/settingsModal"; // Import your SettingsModal if it's defined somewhere
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DefaultLayout from "@/layouts/defaultLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import moment from "moment";
import { Clock, User } from "lucide-react";
import { useInView } from 'react-intersection-observer'

const formSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character long"),
  category: z.number().int().positive("Category ID must be a positive number").default(509658),
});

const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState(509658);

  const { ref, inView } = useInView();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: 509658,
    }
  });

  const fetchVods = async ({ pageParam }) => {
    const response = await searchTwitchVods(searchQuery, pageParam); // Using the correct cursor from pageParam
    const videosData = (response.data[0].data.searchFor as SearchResultsType).videos; // Extract videos data

    // filter out videos that are not from the specified category
    const filteredVideos = videosData.edges.filter((video) => video.item.game?.id === category.toString());

    return {
      results: filteredVideos,  // Access edges array
      nextCursor: videosData.cursor, // Get next cursor from the response
    };
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['twitchVods', searchQuery],
    queryFn: fetchVods,
    initialPageParam: undefined, // Start with no cursor
    enabled: !!searchQuery, // Only enable query when searchQuery exists
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined, // Determine if another page exists
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSearchQuery(values.title);
    setCategory(Number(values.category));
    // form.reset(); // Reset form fields after submission
  }

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <DefaultLayout>
      <Card className="flex items-center justify-center">
        <CardContent className="flex flex-col w-fit mt-4">
          <section className="mb-6">
            <h1 className="text-2xl font-bold text-center">Twitch VOD Search</h1>
          </section>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <section className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <Input type="text" placeholder="Title" className="min-w-[19rem]" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <Input type="number" placeholder="Category ID" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Search</Button>
              </section>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Display search results */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          <div className="w-full h-full grid grid-cols-4 auto-rows-max gap-4">
            {data?.pages.map((group) => (

              group.results.map((vod) => (
                <div className="relative flex col-span-1 row-span-1 h-[16rem] w-full" key={`${vod.trackingID}`}>
                  <Card className="items-center justify-center h-full w-full">
                    <img src={vod.item.previewThumbnailURL} alt={vod.item.title} className="w-full h-[172px] rounded-t-lg cursor-pointer" onClick={() => window.open(vodUrl(vod))} />
                    <h1 className="text-md font-bold text-center line-clamp-2 cursor-pointer" onClick={() => window.open(vodUrl(vod))}>{vod.item.title}</h1>
                    <CardContent className="flex flex-col w-full">

                      <div className="flex flex-row w-full justify-between">
                        <div className="flex flex-row items-center justify-center">
                          <User className="h-[1rem]" />
                          <span className="text-sm cursor-pointer" onClick={() => window.open(channelUrl(vod))}>{vod.item.owner.displayName}</span>
                        </div>
                        <div className="flex flex-row items-center justify-center">
                          <Clock className="h-[1rem]" />
                          <span className="text-sm">{moment(vod.item.createdAt).fromNow()}</span>
                        </div>
                        {/* <span>Length: {vod.item.lengthSeconds} seconds</span> */}
                      </div>

                    </CardContent>

                    <div className="absolute top-0 right-0 p-2">
                      <span className="bg-card rounded-lg px-2 py-1 text-xs">{moment.utc(vod.item.lengthSeconds * 1000).format("HH:mm:ss")}</span>
                    </div>
                  </Card>
                </div>
              ))
            ))
            }
          </div>
          <div>
            <button
              ref={ref}
              onClick={fetchNextPage}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? 'Loading more...'
                : hasNextPage
                  ? 'Load More'
                  : 'Nothing more to load'}
            </button>
          </div>
          {isFetching && !isFetchingNextPage ? 'Fetching...' : null}
        </>
      )}

      <div className="absolute top-0 right-0 p-4">
        <SettingsModal />
      </div>
    </DefaultLayout>
  );

  function vodUrl(video: VideoEdgeType) {
    return `https://www.twitch.tv/videos/${video.item.id}`;
  }

  function channelUrl(video: VideoEdgeType) {
    return `https://www.twitch.tv/${video.item.owner.login}`;
  }
};

export default LandingPage;