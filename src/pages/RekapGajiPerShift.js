import axios from "axios";
import { Component } from "react";
import { FiSearch } from "react-icons/fi";
import { urlAPI } from "../config/Global";
import { differenceInDays, eachDayOfInterval, formatDate } from "date-fns";
import MUIDataTable from "mui-datatables";
import Swal from "sweetalert2";

class RekapGajiPerShift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: new Date().getFullYear(),
      selectedMonth: "",
      dataInsentif: 0,
      dataNominal: [],
      bulan: "",
    };
  }

  handleYearChange = (e) => {
    this.setState({ selectedYear: parseInt(e.target.value) });
  };

  handleMonthChange = (select) => {
    this.setState({ selectedMonth: select.value, bulan: select.label });
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
  cekDataInsentif = () => {
    let tahunAwal = this.state.selectedYear;
    const newData = {
      bulan: this.state.bulan,
      tahun: tahunAwal,
    };
    axios
      .post(urlAPI + "/insentif/cek/data/", newData)
      .then((response) => {
        console.log(response.data, "Insentif");
        if (response.data.length > 0) {
          Swal.fire({
            title: "Perhatian",
            text: "Apakah Anda Ingin Memperbarui Data",
            showDenyButton: true,
            confirmButtonText: "Ya",
            denyButtonText: "Tidak",
            customClass: {
              actions: "my-actions",
              cancelButton: "order-1 right-gap",
              confirmButton: "order-2",
            },
          }).then((result) => {
            if (result.isConfirmed) {
              this.hapusDataInsentif();
            } else if (result.isDenied) {
            }
          });
        } else {
          this.getDataInsentif();
        }
      })
      .catch((error) => {
        console.log("Error pada tanggal", ":", error);
      });
  };
  getData = () => {
    let tahunAwal = this.state.selectedYear;
    const newData = {
      bulan: this.state.bulan,
      tahun: tahunAwal,
    };
    axios
      .post(urlAPI + "/insentif/cek/data/", newData)
      .then((response) => {
        console.log(response.data, "Insentif");
        this.setState({ dataNominal: response.data });
      })
      .catch((error) => {
        console.log("Error pada tanggal", ":", error);
      });
  };
  hapusDataInsentif = () => {
    let tahunAwal = this.state.selectedYear;
    const newData = {
      bulan: this.state.bulan,
      tahun: tahunAwal,
    };
    axios
      .post(urlAPI + "/insentif/hapus/data/", newData)
      .then((response) => {
        console.log(response.data, "Insentif");
        this.getDataInsentif();
      })
      .catch((error) => {
        console.log("Error pada tanggal", ":", error);
      });
  };
  handleSearch = (e) => {
    e.preventDefault();
    this.cekDataInsentif();
  };

  getDataInsentif = () => {
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
    const tanggalAwal = `${tahunAwal}-${bulanAwal}-30`;
    const tanggalAkhir = `${tahunAkhir}-${bulan}-10`;

    const tanggalBanyak = this.getDatesBetween(tanggalAwal, tanggalAkhir);

    let newDataNominal = [];

    tanggalBanyak.forEach((tanggalObj) => {
      const tanggal = tanggalObj.tanggal;

      const postData = {
        tanggal: tanggal,
        bulan: this.state.bulan,
        tahun: tahunAwal,
      };

      axios
        .post(urlAPI + "/insentif/nominal", postData)
        .then((response) => {
          newDataNominal = newDataNominal.concat(response.data);
          console.log(response.data, "Insentif");
          this.setState({ dataNominal: newDataNominal });
        })
        .catch((error) => {
          console.log("Error pada tanggal", tanggal, ":", error);
        });
    });
    console.log(newDataNominal);
  };

  formatRupiah = (angka) => {
    var rupiah = "";
    var angkaRev = angka.toString().split("").reverse().join("");
    for (var i = 0; i < angkaRev.length; i++)
      if (i % 3 == 0) rupiah += angkaRev.substr(i, 3) + ".";
    return (
      "Rp " +
      rupiah
        .split("", rupiah.length - 1)
        .reverse()
        .join("")
    );
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
      return [
        data.tanggal,
        data.nama_shift,
        data.nama_dokter,
        this.formatRupiah(data.garansi_fee),
        this.formatRupiah(data.nominal_shift),
        this.formatRupiah(data.insentif),
        this.formatRupiah(data.kekurangan_garansi_fee),
        this.formatRupiah(data.total_gaji),
      ];
    });

    const columnsData = [
      "Tanggal",
      "Nama Shift",
      "Nama Dokter",
      "Garansi Fee",
      "Nominal",
      "Insentif",
      "Kekurangan",
      "Total Gaji",
    ];

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
                        onChange={(e) =>
                          this.handleMonthChange(
                            months.find(
                              (month) => month.value === e.target.value
                            )
                          )
                        }
                        value={this.state.selectedMonth}
                      >
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
                        value={this.state.selectedYear}
                      >
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
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 flex items-center"
                      >
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
