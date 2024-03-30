import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { urlAPI } from "../config/Global";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataShift: [],
    };
  }

  componentDidMount = () => {
    this.getAllDataShift();
  };

  getAllDataShift = () => {
    axios
      .get(urlAPI + "/shift")
      .then((response) => {
        this.setState({ dataShift: response.data });
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  render() {
    const datas = this.state.dataShift.map((data) => [
      // data.id_shift,
      data.nama_shift,
      data.jam_masuk,
      data.jam_pulang,
      data.nominal,
    ]);

    const columns = ["Nama Shift", "Jam Masuk", "Jam Keluar", "Nominal"];

    const options = {
      selectableRows: false,
      elevation: 0,
      rowsPerPage: 5,
      rowsPerPageOption: [5, 10],
    };

    console.log(datas);
    return (
      <div className="container mx-auto mt-2">
        <div className="rounded-lg bg-white shadow-lg">
          <div className="flex flex-col p-10">
            <h4 className="text-black font-bold text-xl mt-5">
              Form Input Shift
            </h4>
            <br />
            <hr />
            <br />
            <div className="flex">
              <form action="">
                <div className="grid grid-cols-5 gap-4">
                  <input
                    type="text"
                    placeholder="Nama Shift"
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Nama Shift"
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Nama Shift"
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Nama Shift"
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow-lg">
          <div className="flex flex-col p-10">
            <MUIDataTable
              title={"Data Shift"}
              data={datas}
              columns={columns}
              options={options}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
