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
} from "@material-ui/core";
import { IStrip, StripType } from "../../../types/strip";
import Link from "next/link";

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
    sticky: {
        zIndex: 1,
    },
    stickyHover: {
        zIndex: 1,
        right: "0",
        position: "sticky",
    },
});

interface IProps {
    strip: IStrip;
    handleOpenDel: any;
}

const StripItem = ({ strip, handleOpenDel }: IProps) => {
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
        handleOpenDel(strip);
        handleClose();
    };

    const handleMouseOver = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    const handleEdit = () => {
        handleClose();
    };

    return (
        <TableRow
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            classes={{ root: classes.root }}
            key={strip.strip_id}
        >
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {strip.title}
            </TableCell>
            <TableCell style={{ whiteSpace: "nowrap" }}>
                {new Date(strip.created_at).toLocaleString("ar")}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {strip.created_by?.username || (
                    <Typography align="center">-</Typography>
                )}
            </TableCell>
            <TableCell style={{ whiteSpace: "nowrap" }}>
                {new Date(strip.updated_at).toLocaleString("ar")}
            </TableCell>
            <TableCell
                classes={{
                    root: classes.tableCell,
                }}
            >
                {strip.updated_by?.username || (
                    <Typography align="center">-</Typography>
                )}
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
                    <Link
                        href={`/admin/strips/stripForm?stripId=${strip.strip_id}`}
                    >
                        <MenuItem onClick={handleEdit}>تعديل</MenuItem>
                    </Link>
                    <MenuItem onClick={delAction}>حذف</MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    );
};

export default StripItem;
