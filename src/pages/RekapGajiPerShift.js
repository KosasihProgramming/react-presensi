import axios from "axios";
import { Component } from "react";
import { FiSearch } from "react-icons/fi";
import { urlAPI } from "../config/Global";
import { differenceInDays, eachDayOfInterval, formatDate } from "date-fns";
import MUIDataTable from "mui-datatables";

class RekapGajiPerShift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: new Date().getFullYear(),
      selectedMonth: "",
      dataInsentif: 0,
      dataNominal: [],
    };
  }

  handleYearChange = (e) => {
    this.setState({ selectedYear: parseInt(e.target.value) });
  };

  handleMonthChange = (e) => {
    this.setState({ selectedMonth: e.target.value });
  };

  getDatesBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysBetween = differenceInDays(end, start) + 1;
    const datesArray = eachDayOfInterval({ start: start, end: end });

    const formattedDates = datesArray.map((date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Menambahkan angka 0 di depan untuk bulan dengan satu digit
      const day = String(date.getDate()).padStart(2, "0"); // Menambahkan angka 0 di depan untuk hari dengan satu digit
      return { tanggal: `${year}-${month}-${day}` };
    });

    return formattedDates;
  };

  handleSearch = (e) => {
    e.preventDefault();
    // console.log(this.state.selectedMonth);
    // console.log(this.state.selectedYear);
    const bulan = this.state.selectedMonth;
    let tahunAwal = this.state.selectedYear;
    let bulanAwal = parseInt(bulan) - 1;
    let tahunAkhir = this.state.selectedYear;

    if (bulanAwal <= 9 && bulanAwal >= 1) {
      bulanAwal = bulanAwal.toString().padStart(bulanAwal, "0");
    } else if (bulanAwal <= 0) {
      bulanAwal = "12";
      tahunAwal = parseInt(tahunAkhir) - 1;
    } else {
      bulanAwal = bulanAwal.toString();
    }
    const tanggalAwal = `${tahunAwal}-${bulanAwal}-23`;
    const tanggalAkhir = `${tahunAkhir}-${bulan}-22`;

    const tanggalBanyak = this.getDatesBetween(tanggalAwal, tanggalAkhir);

    let newDataNominal = [];

    tanggalBanyak.forEach((tanggalObj) => {
      const tanggal = tanggalObj.tanggal;

      const postData = {
        tanggal: tanggal,
      };

      axios
        .post(urlAPI + "/insentif/nominal", postData)
        .then((response) => {
          newDataNominal = newDataNominal.concat(response.data);
          this.setState({ dataNominal: newDataNominal });
          console.log(response.data);
        })
        .catch((error) => {
          console.log("Error pada tanggal", tanggal, ":", error);
        });
    });
    console.log(newDataNominal);
  };

  render() {
    const months = [
      { value: "01", label: "Januari" },
      { value: "02", label: "Februari" },
      { value: "03", label: "Maret" },
      { value: "04", label: "April" },
      { value: "05", label: "Mei" },
      { value: "06", label: "Juni" },
      { value: "07", label: "Juli" },
      { value: "08", label: "Agustus" },
      { value: "09", label: "September" },
      { value: "10", label: "Oktober" },
      { value: "11", label: "November" },
      { value: "12", label: "Desember" },
    ];

    const startYear = 1999; // Tahun mulai
    const endYear = new Date().getFullYear(); // Tahun saat ini
    const years = [];
    for (let year = endYear; year >= startYear; year--) {
      years.push(year);
    }

    const dataNominalList = this.state.dataNominal.map((data) => {
      return [data.tanggal, data.nama_shift, data.nama, data.nominal];
    });

    const columnsData = ["Tanggal", "Nama Shift", "Nama Dokter", "Nominal"];

    const options = {
      selectableRows: false,
      elevation: 0,
      rowsPerPage: 10,
      rowsPerPageOption: [5, 10],
      filterDate: new Date().toLocaleDateString(),
    };

    return (
      <>
        <div className="container mx-auto mb-16">
          <div className="rounded-lg bg-white shadow-lg my-5">
            <div className="flex flex-col p-10">
              <h4 className="text-black font-bold text-xl">
                Cari Rekapan per shift
              </h4>
              <br />
              <hr />
              <br />
              <div className="flex">
                <form action="" className=" w-full">
                  <div className="flex flex-row items-center">
                    <div className="flex flex-row items-center mr-4">
                      <label className="text-gray-700 font-bold mr-2">
                        Pilih Bulan:
                      </label>
                      <select
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        id="monthDropdown"
                        onChange={this.handleMonthChange}
                        value={this.state.selectedMonth}>
                        <option value="">Pilih</option>
                        {months.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-row items-center mr-4">
                      <label className="text-gray-700 font-bold mr-2">
                        Pilih Tahun:
                      </label>
                      <select
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        id="yearDropdown"
                        onChange={this.handleYearChange}
                        value={this.state.selectedYear}>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-row">
                      <button
                        type="submit"
                        onClick={this.handleSearch}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 flex items-center">
                        <span className="mr-2">Cari</span> <FiSearch />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white shadow-lg">
            <div className="flex flex-col p-10">
              <MUIDataTable
                title={"Data Rekap"}
                data={dataNominalList}
                columns={columnsData}
                options={options}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default RekapGajiPerShift;
