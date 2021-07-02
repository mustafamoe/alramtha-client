import { Grid, Typography, CircularProgress, Box } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { useRef, useState } from "react";
import { apiCall } from "../../../utils/apiCall";
import useSWR, { mutate } from "swr";
import { useSelector } from "react-redux";

// components
import Modal from "../modal";
import Error from "../../form/error";
import { RootReducer } from "../../../store/reducers";
import { IImage } from "../../../types/image";
import TextField from "../../form/input";
import Button from "../../form/button";

interface IError {
    image: string[];
}

interface IProps {
    close: Function;
}

type Image = {
    img: string | ArrayBuffer;
    file: any;
    name: string;
    category: string;
    image_description: string;
};

interface IState {
    images: Image[];
}

const ImageForm = ({ close }: IProps) => {
    const classes = useStyles();
    const fileInput = useRef<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const user = useSelector((state: RootReducer) => state.auth.user);
    const [errors, setErrors] = useState<IError>({
        image: [],
    });
    const [state, setState] = useState<IState>({
        images: [],
    });

    const handleChange = async (e) => {
        if (e.target.files.length) {
            let files: {
                img: string | ArrayBuffer;
                name: string;
                file: any;
                image_description: "";
            }[] = [];

            for (let f of e.target.files) {
                const res = await toBase64(f);
                files.push({
                    img: res,
                    name: f.name,
                    file: f,
                    image_description: "",
                });
            }

            setState({
                ...state,
                [e.target.name]: [...state[e.target.name], ...files],
            });
            e.target.value = "";
        }
    };

    console.log(state);
    const toBase64 = (file: any): Promise<string | ArrayBuffer | null> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleRemove = (i: number) => {
        setState({
            ...state,
            images: [...state.images].filter((a, index) => i !== index),
        });
    };

    const handleValidate = () => {
        const TmpErrors: IError = {
            image: [],
        };

        if (!state.images.length) {
            TmpErrors.image.push("Please browse at least one image.");
        }

        setErrors({ ...errors, ...TmpErrors });

        return TmpErrors;
    };

    const handleSubmit = async (e) => {
        const errors = handleValidate();

        for (let e of Object.values(errors)) {
            if (e.length) return;
        }

        setLoading(true);
        try {
            const formData = new FormData();

            for (let i of state.images) {
                formData.append("image", i.file);
            }

            formData.append(
                "data",
                JSON.stringify(
                    state.images.map((img) => ({
                        category: img.category,
                        image_description: img.image_description,
                    }))
                )
            );
            const images = await apiCall<IImage[]>(
                "post",
                `/images?authId=${user.user_id}`,
                formData
            );

            mutate(
                "/images",
                (imgs) => {
                    return [...imgs, ...images];
                },
                false
            );

            close();
        } catch (err) {
            setLoading(false);
            setErrors({ ...errors, ...err });
        }
    };

    const handleTitle = (e, ind) => {
        setState({
            ...state,
            images: state.images.map((img, i) =>
                i === ind ? { ...img, image_description: e.target.value } : img
            ),
        });
    };

    const handleFileClick = () => {
        if (fileInput.current) fileInput.current.click();
    };

    return (
        <Modal
            width="800px"
            closeInfo={{
                close,
                check: true,
            }}
            type="child"
        >
            <div>
                <Typography variant="h6">
                    Supported files extensions: (jpg, jpeg, svg, png, gif, webp)
                </Typography>
                <Box
                    display="flex"
                    style={{ margin: "20px 0" }}
                    alignItems="center"
                >
                    <Box display="flex" flexDirection="column">
                        <input
                            ref={fileInput}
                            accept="image/*"
                            className={classes.input}
                            multiple
                            name="images"
                            type="file"
                            onChange={handleChange}
                        />
                        <Button
                            variant="contained"
                            text="Browse device"
                            color="red"
                            onClick={handleFileClick}
                        />
                    </Box>
                    <Typography style={{ margin: "0 15px" }}>
                        Selected files {state.images.length}
                    </Typography>
                </Box>
                <Error errors={errors.image} />
                {state.images.length ? (
                    <Box
                        display="flex"
                        style={{ marginTop: "40px" }}
                        flexDirection="column"
                    >
                        {state.images.map((img, i) => (
                            <Grid
                                style={{ marginBottom: "10px" }}
                                container
                                spacing={3}
                                alignItems="center"
                                key={i}
                            >
                                <Grid item xs={2}>
                                    <div className={classes.imgContainer}>
                                        <img
                                            className={classes.img}
                                            src={img.img as string}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={8}>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        width="100%"
                                    >
                                        <Box mb={2}>
                                            <Typography
                                                style={{ width: "100%" }}
                                            >
                                                {img.name}
                                            </Typography>
                                        </Box>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="space-between"
                                        >
                                            <Box width="49%">
                                                <TextField
                                                    label="Description"
                                                    name="image_description"
                                                    value={
                                                        img.image_description
                                                    }
                                                    onChange={(e) =>
                                                        handleTitle(e, i)
                                                    }
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        text="remove"
                                        onClick={() => handleRemove(i)}
                                    />
                                </Grid>
                            </Grid>
                        ))}
                    </Box>
                ) : null}
                <Box
                    display="flex"
                    flexDirection="column"
                    style={{ marginTop: "20px" }}
                >
                    <Button
                        text="Submit"
                        type="submit"
                        variant="contained"
                        onClick={handleSubmit}
                        loading={loading}
                    />
                </Box>
            </div>
        </Modal>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            "& > *": {
                margin: theme.spacing(1),
            },
        },
        input: {
            display: "none",
        },
        formControl: {
            minWidth: 120,
            width: "100%",
        },
        imgContainer: {
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        img: {
            maxWidth: "100%",
            maxHeight: "100%",
            display: "block",
        },
    })
);

export default ImageForm;
