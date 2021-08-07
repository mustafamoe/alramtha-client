import {
    createStyles,
    makeStyles,
    Theme,
    Box,
    CircularProgress,
    MenuItem,
    Typography,
} from "@material-ui/core";
import { Line } from "react-chartjs-2";
import Select from "../../../components/form/select";

// components
import WithRole from "../../../protectors/withRole";
import Layout from "../../../components/admin/layout";
import HeadLayout from "../../../components/headLayout";
import useSWR from "swr";
import { useSelector } from "react-redux";
import { RootReducer } from "../../../store/reducers";
import { useState } from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { countries } from "../../../data/countries";
import ImageOpt from "../../../components/imageOpt";

const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
];

type DataType = "days" | "weeks" | "months" | "years";

const ms = [...Array(12)].map((d, i) => i + 1);

const years = [2019, 2020, 2021];

interface IFilters {
    dataType: DataType;
}

const daysOfWeeks = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
];

const Statistics = () => {
    const classes = useStyles();
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [filters, setFilters] = useState<IFilters>({
        dataType: "days",
    });
    const { data } = useSWR(
        user?.user_id
            ? `/statistics?dataType=${filters.dataType}&authId=${user?.user_id}`
            : ""
    );

    const getLabels = () => {
        switch (filters.dataType) {
            case "days":
                var data: string[] = [];

                for (let i = 0; i < 7; i++) {
                    let sd: Date = new Date();
                    sd.setDate(sd.getDay() - i + 1);

                    data.unshift(daysOfWeeks[sd.getDay()]);
                }

                return data;
            case "weeks":
                return [
                    "الأسبوع الأول",
                    "الأسبوع الثاني",
                    "الأسبوع الثالث",
                    "الأسبوع الرابع",
                ];
            case "months":
                return months;
            case "years":
                return [2019, 2020, 2021];
            default:
                break;
        }
    };

    const getSectionsData = (news: any) => {
        switch (filters.dataType) {
            case "days":
                var data: string[] = [];

                for (let i = 0; i < 7; i++) {
                    const date = new Date();
                    date.setDate(date.getDay() - i + 1);

                    const date2 = new Date();
                    date2.setDate(date2.getDay() - i);

                    const newsSet = news.filter(
                        (n) =>
                            new Date(n.created_at) < date &&
                            new Date(n.created_at) > date2
                    );

                    data.unshift(
                        newsSet.reduce((v, n) => {
                            return n.readers + v;
                        }, 0)
                    );
                }

                return data;
            case "weeks":
                var data: string[] = [];

                for (let i = 0; i < 4; i++) {
                    const date = new Date();
                    date.setDate(date.getDay() - i * 7 + 2);

                    const date2 = new Date();
                    date2.setDate(date2.getDay() - i * 7 - 7);

                    const newsSet = news.filter(
                        (n) =>
                            new Date(n.created_at) < date &&
                            new Date(n.created_at) > date2
                    );
                    data.unshift(
                        newsSet.reduce((v, n) => {
                            return n.readers + v;
                        }, 0)
                    );
                }

                return data;
            case "months":
                var data: string[] = [];

                for (let m of ms) {
                    const newsSet = news.filter(
                        (n) => new Date(n.created_at).getMonth() === m
                    );

                    const total = newsSet.reduce((v, n) => {
                        return n.readers + v;
                    }, 0);

                    data.push(total);
                }

                return data;
            case "years":
                var data: string[] = [];

                for (let y of years) {
                    const newsSet = news.filter(
                        (n) => new Date(n.created_at).getFullYear() === y
                    );

                    const total = newsSet.reduce((v, n) => {
                        return n.readers + v;
                    }, 0);

                    data.push(total);
                }

                return data;
            default:
                break;
        }
    };

    const sections = {
        labels: getLabels(),
        datasets: data?.sections?.map((s) => ({
            label: s.section_name,
            data: getSectionsData(s.news),
            fill: false,
            backgroundColor: s.color,
            tension: 0.4,
            borderColor: s.color,
            borderWidth: 2,
            scaleStepWidth: 1,
        })),
    };

    const generateNewsPerDay = (news: any) => {
        switch (filters.dataType) {
            case "days":
                var data: string[] = [];

                for (let i = 0; i < 7; i++) {
                    const date = new Date();
                    date.setDate(date.getDay() - i + 1);

                    const date2 = new Date();
                    date2.setDate(date2.getDay() - i);

                    const newsSet = news.filter(
                        (n) =>
                            new Date(n.created_at) < date &&
                            new Date(n.created_at) > date2
                    );

                    data.unshift(newsSet.length);
                }

                return data;
            case "weeks":
                var data: string[] = [];

                for (let i = 0; i < 4; i++) {
                    const date = new Date();
                    date.setDate(date.getDay() - i * 7 + 2);

                    const date2 = new Date();
                    date2.setDate(date2.getDay() - i * 7 - 7);

                    const newsSet = news.filter(
                        (n) =>
                            new Date(n.created_at) < date &&
                            new Date(n.created_at) > date2
                    );

                    data.unshift(newsSet.length);
                }

                return data;
            case "months":
                var data: string[] = [];

                for (let m of ms) {
                    const newsSet = news.filter(
                        (n) => new Date(n.created_at).getMonth() === m
                    );

                    data.push(newsSet.length);
                }

                return data;
            case "years":
                var data: string[] = [];

                for (let y of years) {
                    const newsSet = news.filter(
                        (n) => new Date(n.created_at).getFullYear() === y
                    );

                    data.unshift(newsSet.length);
                }

                return data;
            default:
                break;
        }
    };

    const newsPerDay = {
        labels: getLabels(),
        datasets: [
            {
                label: "عدد الأخبار المنشورة",
                data: data?.news ? generateNewsPerDay(data.newsPerDay) : [],
                fill: false,
                backgroundColor: "rgba(102, 45, 145, 0.2)",
                borderColor: "rgb(102, 45, 145)",
                borderWidth: 2,
                hoverBackgroundColor: "black",
                hoverBorderColor: "black",
                tension: 0.4,
                scaleStepWidth: 1,
            },
        ],
    };

    const news = {
        labels: getLabels(),
        datasets: [
            {
                label: "عدد مشاهدات الأخبار",
                data: data?.news ? getSectionsData(data.news) : [],
                fill: false,
                backgroundColor: "#9e005c3b",
                borderColor: "#9E005D90",
                borderWidth: 2,
                hoverBackgroundColor: "black",
                hoverBorderColor: "black",
                scaleStepWidth: 1,
                tension: 0.4,
            },
        ],
    };

    return (
        <>
            <HeadLayout title="Admin statistics" />
            <WithRole role="is_admin">
                <Layout>
                    <div className={classes.head}>
                        <Box mr={4} display="flex">
                            <h3>تصنيف:</h3>
                        </Box>
                        <Select
                            name="dataType"
                            state={filters}
                            setState={setFilters}
                            label="التصنيف حسب"
                            value={filters.dataType}
                            notEmpty={true}
                        >
                            <MenuItem value="days">الأيام</MenuItem>
                            <MenuItem value="weeks">الأسابيع</MenuItem>
                            <MenuItem value="months">الأشهر</MenuItem>
                            <MenuItem value="years">السنوات</MenuItem>
                        </Select>
                    </div>
                    <Box
                        display="flex"
                        style={{
                            borderBottom: "1px solid rgb(185, 185, 185)",
                            paddingBottom: "20px",
                            marginBottom: "20px",
                            overflow: "auto",
                            whiteSpace: "nowrap",
                        }}
                    >
                        <Box ml={3} mr={3}>
                            <Typography variant="h5">
                                اجمالي عدد الزوار:{" "}
                                {data?.visitors?.reduce((v, visit) => {
                                    return (
                                        Number(visit.metricValues[0].value) + v
                                    );
                                }, 0)}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h5">
                                اجمالي عدد القرآت لليوم:{" "}
                                {data?.trtNews?.reduce((v, n) => {
                                    return n.readers + v;
                                }, 0)}
                            </Typography>
                        </Box>
                        <Box ml={3} mr={3}>
                            <Typography variant="h5">
                                اجمالي عدد القرآت:{" "}
                                {data?.news?.reduce((v, n) => {
                                    return n.readers + v;
                                }, 0)}
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        style={{
                            borderBottom: "1px solid rgb(185, 185, 185)",
                            paddingBottom: "20px",
                            marginBottom: "20px",
                            overflow: "auto",
                            whiteSpace: "nowrap",
                        }}
                        display="flex"
                        justifyContent="space-evenly"
                    >
                        {data?.sections?.map((s) => (
                            <Box
                                mr={2}
                                ml={2}
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                            >
                                <Typography
                                    style={{ color: s.color }}
                                    key={s.section_id}
                                    variant="h5"
                                >
                                    {s.section_name}
                                </Typography>
                                <Typography
                                    style={{ color: s.color }}
                                    key={s.section_id}
                                    variant="h5"
                                >
                                    (
                                    {s.news?.reduce((v, n) => {
                                        return n.readers + v;
                                    }, 0)}
                                    )
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                    <div className={classes.visitorsContainer}>
                        {data?.visitors?.map((v) => {
                            const {
                                dimensionValues: [countryId],
                                metricValues: [count],
                            } = v;

                            const country = countries.find(
                                (c) => c.alpha2Code === countryId.value
                            );

                            return (
                                <Box
                                    ml={3}
                                    mr={3}
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    key={v.visitor_id}
                                >
                                    {country?.flag && (
                                        <Box mb={1}>
                                            <ImageOpt
                                                src={country.flag}
                                                location="other"
                                                width={40}
                                                height={20}
                                            />
                                        </Box>
                                    )}
                                    <Box ml={2} display="flex">
                                        {country && (
                                            <Typography>
                                                {country.name}
                                            </Typography>
                                        )}
                                        <Box ml={1}>
                                            <Typography>
                                                ({count.value})
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })}
                    </div>
                    {!data ? (
                        <Box mt={10} display="flex" justifyContent="center">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <Box className={classes.double}>
                                <div className={classes.newPerDayContainer}>
                                    <Line data={newsPerDay} />
                                </div>
                                <div>
                                    <Line data={news} />
                                </div>
                            </Box>
                            <Box>
                                <div>
                                    <Line data={sections} />
                                </div>
                            </Box>
                            <Box className={classes.double}>
                                <Box>
                                    <Box mb={2}>
                                        <h3>أكثر 10 خبر قراءة (24 ساعة)</h3>
                                    </Box>
                                    <div className={classes.newsList}>
                                        {data?.news24hr?.map((n) => (
                                            <Box
                                                mb={1}
                                                pb={1}
                                                style={{
                                                    borderBottom:
                                                        "1px solid rgb(179, 179, 179)",
                                                }}
                                                display="flex"
                                                justifyContent="space-between"
                                            >
                                                <Typography>
                                                    {n.title}
                                                </Typography>
                                                <Box
                                                    ml={2}
                                                    display="flex"
                                                    alignItems="center"
                                                >
                                                    <Typography>
                                                        {n.readers}
                                                    </Typography>
                                                    <Box ml={1}>
                                                        <VisibilityIcon />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))}
                                    </div>
                                </Box>
                                <Box>
                                    <Box mb={2}>
                                        <h3>أكثر 10 خبر قراءة (حسب التصنيف)</h3>
                                    </Box>
                                    <div className={classes.newsList}>
                                        {data?.latestNews?.map((n) => (
                                            <Box
                                                mb={1}
                                                pb={1}
                                                style={{
                                                    borderBottom:
                                                        "1px solid rgb(179, 179, 179)",
                                                }}
                                                display="flex"
                                                justifyContent="space-between"
                                            >
                                                <Typography>
                                                    {n.title}
                                                </Typography>
                                                <Box
                                                    ml={2}
                                                    display="flex"
                                                    alignItems="center"
                                                >
                                                    <Typography>
                                                        {n.readers}
                                                    </Typography>
                                                    <Box ml={1}>
                                                        <VisibilityIcon />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ))}
                                    </div>
                                </Box>
                            </Box>
                        </>
                    )}
                </Layout>
            </WithRole>
        </>
    );
};

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        head: {
            width: "100%",
            padding: theme.spacing(2, 0),
            marginBottom: theme.spacing(2),
            display: "flex",
            alignItems: "center",
        },
        title: {
            fontWeight: 300,
        },
        body: {
            width: "100%",
            maxWidth: "100%",
        },
        double: {
            display: "grid",
            [theme.breakpoints.up("lg")]: {
                gridTemplateColumns: "1fr 1fr",
            },
            gridTemplateColumns: "1fr",
            gridGap: "20px",
            marginBottom: "20px",
        },
        newsList: {
            maxHeight: "500px",
            overflowY: "auto",
            padding: "0 10px",
        },
        newPerDayContainer: {
            margin: "20px 0",
        },
        visitorsContainer: {
            display: "flex",
            whiteSpace: "nowrap",
            overflowY: "auto",
            paddingBottom: "10px",
        },
    });
});

export default Statistics;
