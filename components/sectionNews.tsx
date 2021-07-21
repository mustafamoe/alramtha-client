import {
    createStyles,
    makeStyles,
    Theme,
    CircularProgress,
} from "@material-ui/core";
import useSWR from "swr";
import { INews } from "../types/news";
import { ISection } from "../types/section";
import Pagination from "@material-ui/lab/Pagination";
import LargeNews from "./news/largeNews";
import { useEffect, useState } from "react";

interface IProps {
    data: any;
}

const SectionNews = ({ data }: IProps) => {
    if (data?.news?.length)
        return (
            <div style={{ marginBottom: "25px" }}>
                <div className="author-title">
                    <h1>
                        <span
                            style={{
                                borderColor: `${data.color}`,
                            }}
                        >
                            {data.section_name}
                        </span>
                    </h1>
                </div>
                <NewsList section={data} />
                <div>
                    <img style={{ maxWidth: "100%" }} src="/blueAdvBig.jpg" />
                </div>
            </div>
        );

    return null;
};

const NewsList = ({ section }: { section: ISection }) => {
    const classes = useStyles();
    const rowsPerPage = 4;
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const { data } = useSWR<{ results: number; news: INews[] }>(
        `/news?p=${page}&r=${rowsPerPage}&type=published&sectionId=${section.section_id}`
    );

    useEffect(() => {
        if (data) {
            setCount(Math.ceil(data.results / rowsPerPage));
        }
    }, [data]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <div className={classes.root}>
            {!data ? (
                <div className={classes.loadingContainer}>
                    <CircularProgress color="primary" />
                </div>
            ) : (
                <div className={classes.list}>
                    {data.news?.map((n) => (
                        <LargeNews key={n.news_id} news={n} />
                    ))}
                </div>
            )}
            <Pagination
                onChange={handleChangePage}
                count={count}
                shape="rounded"
                color="primary"
            />
        </div>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginBottom: "30px",
        },
        list: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridGap: "20px",
            marginBottom: "20px",
            "@media screen and (max-width: 1000px)": {
                gridTemplateColumns: "1fr",
            },
            "@media screen and (max-width: 800px)": {
                gridTemplateColumns: "1fr 1fr",
            },
            "@media screen and (max-width: 550px)": {
                gridTemplateColumns: "1fr",
            },
        },
        loadingContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "550px",
        },
    })
);

export default SectionNews;
