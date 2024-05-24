import axios from "axios";
import MUIDataTable from "mui-datatables";
import React, { Component } from "react";
import { HiOutlineSelector } from "react-icons/hi";
import { urlAPI } from "../../config/Global";

class RekapKehadiranDokter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kehadiranDokter: [],
    };
  }

  componentDidMount = () => {
    this.getAllKehadiranDokter();
  };

  getAllKehadiranDokter = async () => {
    try {
      const response = await axios.get(urlAPI + "/rekap-kehadiran-dokter");
      this.setState({ kehadiranDokter: response.data });
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  render() {
    const dataKehadiranDokter = this.state.kehadiranDokter.map((data) => [
      data.tanggal,
      data.barcode,
      data.nama,
      data.telat + " Menit",
      data.nominal,
    ]);

    const columns = ["Tanggal", "Barcode", "Nama Dokter", "Telat", "Nominal"];

    const options = {
      selectableRows: "none",
      elevation: 0,
      rowsPerPage: 10,
      rowsPerPageOption: [5, 10],
      filterDate: new Date().toLocaleDateString(),
    };

    return (
      <>
        <div className="container mx-auto mb-16 mt-5 ">
          <div className="rounded-lg bg-white shadow-lg">
            <div className="flex flex-col pb-10 px-7">
              <MUIDataTable
                title={"Data Kehadiran Dokter"}
                data={dataKehadiranDokter}
                columns={columns}
                options={options}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default RekapKehadiranDokter;
