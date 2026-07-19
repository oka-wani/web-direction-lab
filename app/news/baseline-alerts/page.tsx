import NewsArticle from "../../components/NewsArticle";
import { newsItems } from "../news-data";

export default function Page() { return <NewsArticle item={newsItems[1]} />; }
