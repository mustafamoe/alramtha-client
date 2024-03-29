import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { useState } from "react";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import {
    makeStyles,
    Typography,
    Button,
    Menu,
    MenuItem,
    Box,
    IconButton,
} from "@material-ui/core";
import { IMessage } from "../../../types/message";
import { apiImage } from "../../../utils/apiCall";
import ImageOpt from "../../imageOpt";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCreateNews } from "../../../store/actions/news";
import { useRouter } from "next/router";

// icons
import VisibilityIcon from "@material-ui/icons/Visibility";

const useStyles = makeStyles({
    root: {
        "&:hover": {
            boxShadow:
                "0px 0px 5px 1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
            backgroundColor: "rgb(245, 245, 245)",
        },
    },
    tableCell: {
        maxWidth: "200px",
        whiteSpace: "nowrap",
        overflowX: "hidden",
        textOverflow: "ellipsis",
    },
    largeCell: {
        width: "40%",
        maxWidth: "400px",
        whiteSpace: "nowrap",
        overflowX: "hidden",

        textOverflow: "ellipsis",
    },
    sticky: {
        zIndex: 1,
    },
    stickyHover: {
        zIndex: 1,
        right: "0",
        position: "sticky",
    },
    imgsContainer: {
        display: "flex",
        height: "50px",
    },
    imgContainer: {
        width: "50px",
        boxShadow:
            "0px 0px 5px 1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
        height: "50px",
        borderRadius: "50%",
        overflow: "hidden",
        position: "relative",
        marginLeft: "-10px",
        transition: "all 1s ease",
        backgroundColor: "white",
        "&:hover": {
            marginTop: "-20px",
            zIndex: 100,
            transform: "scale(2)",
            borderRadius: "0",
        },
    },
});

interface IProps {
    message: IMessage;
    handleToggleDetails: any;
}

const MessageItem = ({ message, handleToggleDetails }: IProps) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const classes = useStyles();
    const [isHover, setHover] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const delAction = () => {
        handleClose();
    };

    const handleMouseOver = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    const handleDetails = () => {
        handleToggleDetails(message);
        handleClose();
    };

    const handleCreateNews = () => {
        dispatch(addToCreateNews(message as any));
        router.push(`/admin/news/addNews#message`);
    };

    return (
        <TableRow
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            classes={{ root: classes.root }}
            key={message.message_id}
        >
            <TableCell
                classes={{
                    root: classes.largeCell,
                }}
            >
                {message.subject}
            </TableCell>
            <TableCell>
                {message.images.length ? (
                    <div className={classes.imgsContainer}>
                        {message.images.map((image) => (
                            <div
                                key={image.image_id}
                                className={classes.imgContainer}
                            >
                                <a
                                    href={apiImage(image?.sizes?.m)}
                                    target="_blank"
                                >
                                    <ImageOpt
                                        src={image?.sizes?.m}
                                        objectFit="cover"
                                        layout="fill"
                                    />
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>لا يوجد صور</p>
                )}
            </TableCell>
            <TableCell style={{ whiteSpace: "nowrap" }}>
                {new Date(message.created_at).toLocaleString("ar")}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {message.created_by?.username || (
                    <Typography align="center">-</Typography>
                )}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                <IconButton onClick={handleDetails}>
                    <VisibilityIcon />
                </IconButton>
            </TableCell>
            <TableCell
                classes={{
                    root: isHover ? classes.stickyHover : classes.sticky,
                }}
            >
                <Box width={45}>
                    <Button
                        style={{ minWidth: "100%" }}
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={handleClick}
                    >
                        <MoreHorizIcon />
                    </Button>
                </Box>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleDetails}>معاينة</MenuItem>
                    <Link
                        href={`/admin/messages/sendMessage?messageId=${message.message_id}&replay=${message.created_by?.user_id}`}
                    >
                        <MenuItem onClick={delAction}>رد</MenuItem>
                    </Link>
                    <Link
                        href={`/admin/messages/sendMessage?messageId=${message.message_id}#forward`}
                    >
                        <MenuItem onClick={delAction}>اعادة توجيه</MenuItem>
                    </Link>
                    <MenuItem onClick={handleCreateNews}>انشاء خبر</MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    );
};

export default MessageItem;
