import { createStyles, makeStyles, Theme, Box } from "@material-ui/core";
import { useSelector } from "react-redux";
import { RootReducer } from "../../../store/reducers";

// components
import WithRole from "../../../protectors/withRole";
import Layout from "../../../components/admin/layout";
import HeadLayout from "../../../components/headLayout";

// icons
import UserList from "../../../components/admin/user/userList";

const Users = () => {
    const locale = useSelector((state: RootReducer) => state.locale);
    const classes = useStyles({ locale });

    return (
        <>
            <HeadLayout title="Admin users" />
            <WithRole role="is_admin">
                <Layout>
                    <div className={classes.head}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                        >
                            <div>
                                <h1 className={classes.title}>الاعضاء</h1>
                            </div>
                        </Box>
                    </div>
                    <div className={classes.body}>
                        <UserList />
                    </div>
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
    });
});
export default Users;
