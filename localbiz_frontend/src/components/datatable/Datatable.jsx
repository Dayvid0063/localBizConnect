import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { usersApiRequests } from "../../api";
import { toast } from "react-toastify";

const Datatable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await usersApiRequests.getUsers();
        // Transform the fetched data to match the productRows format
        const transformedData = response.data.data.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          business: user.businessName,
          number: user.phoneNumber,
        }));
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (email) => {
    try {
      // Make an API request to delete the user with the given email
      await usersApiRequests.deleteUser(email);

      // Update the local state by filtering out the deleted user
      setData((prevData) => prevData.filter((item) => item.email !== email));
      toast.success("User deleted Successfully");
      console.log(`User with email ${email} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting user with email ${email}:`, error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/users/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.email)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New User
        <Link to="/users/add-user" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default Datatable;
