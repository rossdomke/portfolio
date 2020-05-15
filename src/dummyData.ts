import { Post } from "@/types";
const postGenerator = function (num : number) : Array<Post> {
  const posts = [];
  for(let i = 0; i < num; i += 1) {
    posts.push({ title: `Test Post ${i}`, slug: `test-post-${i}`})
  }
  return posts;
}
export const Posts : Array<Post> = postGenerator(100);