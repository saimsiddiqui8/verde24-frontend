import {
	Button,
	DashboardSection,
	DropdownField,
	InputField,
} from "../../../../components";
import { Typography } from "@material-tailwind/react";

const TABLE_HEAD = [
	"All Cities",
];


const TABLE_ROWS = [
	{
		city1: "City Name 1",
		city2: "City Name 2",
		city3: "City Name 3",
		city5: "City Name 4",
		city6: "City Name 5",
	},
	{
		city1: "City Name 6",
		city2: "City Name 7",
		city3: "City Name 8",
		city5: "City Name 9",
		city6: "City Name 10",
	},
	{
		city1: "City Name 11",
		city2: "City Name 12",
		city3: "City Name 13",
		city5: "City Name 14",
		city6: "City Name 15",
	},
	{
		city1: "City Name 16",
		city2: "City Name 17",
		city3: "City Name 18",
		city5: "City Name 19",
		city6: "City Name 20",
	},
	{
		city1: "City Name 21",
		city2: "City Name 22",
		city3: "City Name 23",
		city5: "City Name 24",
		city6: "City Name 25",
	},
];



export default function BookLabTest() {
	return (
		<DashboardSection>
			<div className="flex flex-col sm:flex-row justify-between my-4">
				<h2 className="text-2xl sm:text-3xl font-semibold">Select A City</h2>
			</div>
			<div className="flex flex-col gap-0 sm:flex-row items-center sm:gap-2">
				<DropdownField
					options={[
						{ label: "City 1", value: "city1" },
						{ label: "City 2", value: "city2" },
					]}
					name="city"
					placeholder="Search For City"
					className="w-full sm:w-1/3"
				/>
				<InputField
					placeholder="Search for Tests and Packages"
					className="w-full"
				/>
				<Button title="Search" className="w-full sm:w-fit" secondary />
			</div>
			<div className="overflow-x-auto">
				<table className="w-full min-w-max table-auto text-left">
					<thead>
						<tr>
							{TABLE_HEAD.map((head) => (
								<th key={head} className="bg-white p-2 sm:p-4">
									<Typography
										variant="small"
										className="font-normal leading-none"
									>
										{head}
									</Typography>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{TABLE_ROWS.map((row, index) => (
							<tr key={index} className="odd:bg-[#5C89D826]">
								<td className="p-2 sm:p-4">
									<Typography variant="small" className="font-normal">
										{row.city1}
									</Typography>
								</td>
								<td className="p-2 sm:p-4">
									<Typography variant="small" className="font-normal">
										{row.city2}
									</Typography>
								</td>
								<td className="p-2 sm:p-4">
									<Typography variant="small" className="font-normal">
										{row.city3}
									</Typography>
								</td>
								<td className="p-2 sm:p-4">
									<Typography variant="small" className="font-normal">
										{row.city5}
									</Typography>
								</td>
								<td className="p-2 sm:p-4">
									<Typography variant="small" className="font-normal">
										{row.city6}
									</Typography>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</DashboardSection>
	);
}

