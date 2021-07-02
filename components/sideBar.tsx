// Main
import useSWR from "swr";
import Image from "next/image";
import { useState } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Box } from "@material-ui/core";
import SmallNews from "./news/smallNews";
import { ITag } from "../types/tag";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const SideBar = () => {
    const { data } =
        useSWR<{
            results: number;
            tags: ITag[];
        }>(`/tags?p=1&r=50`);
    const { data: news } = useSWR("/news");

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const selected = (num) => {
        if (num === value)
            return {
                backgroundColor: "#0287fe",
                color: "white",
            };
        else return { backgroundColor: "black", color: "white" };
    };

    return (
        <div className="news-side-bar">
            <Tabs value={value} onChange={handleChange} variant="fullWidth">
                <Tab
                    label="الاكثر شهره"
                    style={selected(0)}
                    className="tabs-styles"
                />
                <Tab
                    label="الاجدد"
                    style={selected(1)}
                    className="tabs-styles"
                />
            </Tabs>

            <Box mt="30px">
                <TabPanel value={value} index={0}>
                    <div style={{ minHeight: "100px" }}>
                        <ul style={{ width: "100%" }}>
                            {news &&
                                news.news.map((item) => (
                                    <SmallNews key={item.news_id} data={item} />
                                ))}
                        </ul>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div style={{ minHeight: "100px" }}>
                        <ul>
                            {news &&
                                news.news.map((item) => (
                                    <SmallNews key={item.news_id} data={item} />
                                ))}
                        </ul>
                    </div>
                </TabPanel>
            </Box>

            <div style={{ margin: "3rem 0" }}>
                <div className="author-title">
                    <h1>
                        <span
                            style={{
                                borderColor: "#33a3f1",
                            }}
                        >
                            العلامات
                        </span>
                    </h1>
                </div>

                <div className="side-bar-tags">
                    {data &&
                        data.tags.map((i) => (
                            <a key={i.tag_id}>{i.tag_name}</a>
                        ))}
                </div>
            </div>

            <div className="side-bar-adv">
                <Image src="/news1.jpg" layout="fill" objectFit="cover" />
            </div>
        </div>
    );
};

export default SideBar;
