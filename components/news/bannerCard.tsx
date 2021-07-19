import { SwiperSlide } from "swiper/react";
import Link from "next/link";
import ImageOpt from "../imageOpt";

import Slider from "../slider";
import { INews } from "../../types/news";

interface IProps {
    data: any;
    type: boolean;
}

const BannerCard = ({ data, type }: IProps) => {
    return (
        <div className="banner-card">
            {data?.news ? (
                type ? (
                    <Slider spaceBetween={1}>
                        {data.news.map((news: INews) => (
                            <SwiperSlide key={news.news_id}>
                                <div className="newsContainer">
                                    <ImageOpt
                                        priority={true}
                                        src={news.thumbnail?.sizes?.m}
                                        objectFit="cover"
                                        layout="fill"
                                    />
                                </div>
                                <div className="overlay">
                                    <div className="card-content">
                                        <a
                                            style={{
                                                backgroundColor: `${data.color}`,
                                            }}
                                        >
                                            {data.section_name}
                                        </a>
                                        <Link href={`/news/${news.news_id}`}>
                                            <p>{news.title}</p>
                                        </Link>
                                        {/* <ul>
                                            <li>{news.created_at}</li>
                                            <li>0 القراء</li>
                                        </ul> */}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Slider>
                ) : (
                    <>
                        <ImageOpt
                            src={data.news[0]?.thumbnail?.sizes?.m}
                            objectFit="cover"
                            layout="fill"
                        />
                        <div className="overlay">
                            <div className="card-content">
                                <a
                                    style={{
                                        backgroundColor: `${data.color}`,
                                    }}
                                >
                                    {data.section_name}
                                </a>
                                <Link href={`/news/${data.news[0]?.news_id}`}>
                                    <p>{data.news[0]?.title}</p>
                                </Link>
                                {/* <ul>
                                    <li>{data.news[0]?.created_at}</li>
                                    <li>0 القراء</li>
                                </ul> */}
                            </div>
                        </div>
                    </>
                )
            ) : null}
        </div>
    );
};

export default BannerCard;
