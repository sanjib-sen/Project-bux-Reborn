import React, { useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import AppNavBar from "../components/NavBar";
import { makeStyles } from "@material-ui/core/styles";
import Footer from "../components/footer";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
}));
const columns = [
	{ field: "id", hide: true },
	{ field: "raw", hide: true },
	{ field: "date", headerName: "Deadline", width: 200, sortable: false },
	{ field: "courseID", headerName: "Course", width: 200 },
	{ field: "type", headerName: "Assesment Type", width: 200 },
	{
		field: "title",
		headerName: "Assesment Name",
		sortable: false,
		width: 900,
	},
];

const DataTable = () => {
	const classes = useStyles();
	const [courses, setCourses] = useState([]);
	const all = [];
	useEffect(() => {
		var list = [];
		const cookies = localStorage.getItem("cookies");
		const links = localStorage.getItem("courses").split(",");
		async function fetchAPI(link) {
			await fetch(`/api/courses`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ cookies, link }),
			})
				.then((tmpres) => tmpres.json())
				.then((data) => list.push(data));
		}

		async function childTask() {
			const promises = links.map(async (link) => {
				return await fetchAPI(link);
			});
			await Promise.all(promises);
		}

		(async () => {
			await childTask()
				.then(() =>
					list.map(
						async (course) =>
							await course.map(async (task) => all.push(task)),
					),
				)
				.then(async () => setCourses(all));
		})();
	}, []);

	return (
		<div>
			<AppNavBar>
				<Typography variant="h6" className={classes.title}>
					All Assesments
				</Typography>
			</AppNavBar>
			{courses.length > 0 ? (
				<div>
					<Grid style={{ height: 900, width: "100%" }}>
						<DataGrid
							disableSelectionOnClick
							rows={courses}
							columns={columns}
							pageSize={15}
							sortModel={[
								{
									field: "raw",
									sort: "desc",
								},
							]}
						/>
					</Grid>
				</div>
			) : (
				<Typography variant="h4" align="center">
					Retrieving Data..... <br></br> Please wait
				</Typography>
			)}
			<Footer />
		</div>
	);
};

export default DataTable;