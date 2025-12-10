interface Product {
  name: string;
  description: string;
  price: number;
  category?: string;
}

interface GeneratePostsResponse {
  posts: Array<{
    platform: "twitter" | "instagram" | "linkedin";
    content: string;
  }>;
  generated_at: string;
  count: number;
  isError?: boolean;
}

interface OpenAISettings {
  model: string;
  temperature: number;
  webSearch: boolean;
}

interface GenerateOptions {
  numberOfPosts: number;
  platforms: string[];
}

interface PlatformDetails {
  maxLength: number;
  hashtagLimit: number;
  name: string;
}

interface PlatformsResponse {
  platforms: string[];
  details: Record<string, PlatformDetails>;
}

export async function getPlatforms(): Promise<PlatformsResponse> {
  console.log("THE URL", process.env.NEXT_PUBLIC_API_URL)
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/platforms/`
  );
  return response.json();
}

export async function getDefaultProduct(): Promise<Product> {
  //console.log("DEFAULT: ", `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/default-product`)
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/default-product`
  );
  return response.json();
}

export async function generatePosts(
  product: Product,
  openai_settings: OpenAISettings,
  options: GenerateOptions
): Promise<GeneratePostsResponse> {

  console.log(openai_settings, options);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        name: product.name, 
        description: product.description,
        price: product.price,
        category: product.category,
        generate_options: {
          number_of_posts: options.numberOfPosts,
          platforms: options.platforms
        },
        openai_settings: {
          model_name: openai_settings.model,
          temperature: openai_settings.temperature,
          web_search: openai_settings.webSearch
        }
      })
      
    }
  );

  return response.json();
}
