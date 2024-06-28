import axios from "axios";
import MUIDataTable from "mui-datatables";
import { Component } from "react";
import { urlAPI } from "../config/global";
import { Link } from "react-router-dom";
import { HiOutlineSelector } from "react-icons/hi";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

class Kehadiran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataKehadiran: [],
      dataKepulangan: [],
      isSudahPulang: false,
      tanggalFilter: new Date().toLocaleDateString(),
    };
  }

  componentDidMount = () => {
    this.getAllDataKehadiran();
    this.getAllDataKepulangan();
  };

  getAllDataKehadiran = () => {
    axios
      .get(urlAPI + "/kehadiran/now")
      .then((response) => {
        this.setState({ dataKehadiran: response.data });
        // console.log("Belum pulang: ", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  getAllDataKepulangan = () => {
    axios
      .get(`${urlAPI}/kehadiran/pulang/all`)
      .then((response) => {
        this.setState({ dataKepulangan: response.data });
        console.log("Sudah Pulang: ", response.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };

  handleChange = (e) => {
    const value = e.target.value === "Sudah Pulang" ? true : false;
    this.setState({ isSudahPulang: value });
  };

  handleTanggalFilterChange = (e) => {
    const tanggalParam = e.target.value;
    this.setState({ tanggalFilter: tanggalParam });
    axios
      .get(`${urlAPI}/kehadiran/filter/${tanggalParam}`)
      .then((response) => {
        this.setState({ dataKepulangan: response.data });
      })
      .catch((err) => {
        console.error("Error Fetching data", err);
      });
  };

  render() {
    const dataHadir = this.state.dataKehadiran.map((data) => {
      const masukDate = new Date(data.jam_masuk);

      const tanggal = masukDate.getDate();
      const bulan = masukDate.getMonth() + 1;
      const tahun = masukDate.getFullYear();
      const jam = masukDate.getHours();
      const menit = masukDate.getMinutes();
      const detik = masukDate.getSeconds();

      const formatTanggal = `${tanggal}-${bulan}-${tahun}`;
      const formatJam = `${jam}:${menit}:${detik}`;

      const masukTime = `${formatJam} WIB, ${formatTanggal} `;

      return [
        data.nama,
        data.barcode.toString().padStart(5, "0"),
        data.nama_shift,
        masukTime,
        <img
          className="w-24 rounded-full"
          src={`${urlAPI}/uploads/${data.foto_masuk}`}
          alt={data.foto_masuk}
        />,
      ];
    });

    const dataPulang = this.state.dataKepulangan.map((data) => {
      const masukDate = new Date(data.jam_masuk);

      const tanggal = masukDate.getDate();
      const bulan = masukDate.getMonth() + 1;
      const tahun = masukDate.getFullYear();
      const jam = masukDate.getHours();
      const menit = masukDate.getMinutes();
      const detik = masukDate.getSeconds();

      const formatTanggal = `${tanggal}-${bulan}-${tahun}`;
      const formatJam = `${jam}:${menit}:${detik}`;

      const masukTime = `${formatJam} WIB`;

      const pulangDate = new Date(data.jam_keluar);

      const tanggalPulang = pulangDate.getDate();
      const bulanPulang = pulangDate.getMonth() + 1;
      const tahunPulang = pulangDate.getFullYear();
      const jamPulang = pulangDate.getHours();
      const menitPulang = pulangDate.getMinutes();
      const detikPulang = pulangDate.getSeconds();

      const formatTanggalPulang = `${tanggalPulang}-${bulanPulang}-${tahunPulang}`;
      const formatJamPulang = `${jamPulang}:${menitPulang}:${detikPulang}`;

      const pulangTime = `${formatJamPulang} WIB`;
      return [
        data.nama,
        data.barcode.toString().padStart(5, "0"),
        data.nama_shift,
        masukTime,
        pulangTime,
        data.tanggal,
        <img
          className="w-24 rounded-full"
          src={`${urlAPI}/uploads/${data.foto_masuk}`}
          alt={data.foto_masuk}
        />,
        <img
          className="w-24 rounded-full"
          src={`${urlAPI}/uploads/${data.foto_keluar}`}
          alt={data.foto_keluar}
        />,
      ];
    });

    const columnsHadir = [
      "Nama Dokter",
      "Barcode",
      "Shift",
      "Jam Masuk",
      "Foto Masuk",
      {
        name: "Aksi",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            const item = this.state.dataKehadiran[tableMeta.rowIndex];
            return (
              <div className="flex flex-row justify-center gap-2">
                <Link
                  className="rounded-lg bg-cyan-500 px-4 py-2 font-bold text-white cursor-pointer hover:bg-cyan-700"
                  to={`/pulang/${item.id_kehadiran}`}>
                  Absen Pulang
                </Link>
              </div>
            );
          },
        },
      },
    ];

    const columnsPulang = [
      "Nama Pegawai",
      "Barcode",
      "Shift",
      "Jam Masuk",
      "Jam Keluar",
      "Tanggal",
      "Foto Masuk",
      "Foto Foto Keluar",
    ];

    const options = {
      selectableRows: false,
      elevation: 0,
      rowsPerPage: 10,
      rowsPerPageOption: [5, 10],
      filterDate: new Date().toLocaleDateString(),
    };

    const { isSudahPulang, dataKehadiran, dataKepulangan } = this.state;

    const selectedData = isSudahPulang ? dataKepulangan : dataKehadiran;
    const selectedColumns = isSudahPulang ? columnsPulang : columnsHadir;

    console.log(this.state.tanggalFilter);

    return (
      <>
        <div className="container mx-auto mb-16 mt-5 ">
          <div className="rounded-lg bg-white shadow-lg">
            <div className="flex flex-rows items-center gap-5 pt-4 px-6 ">
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white "
                  onChange={(e) =>
                    this.setState({
                      isSudahPulang: e.target.value === "true",
                    })
                  }>
                  <option value={false}>Belum Pulang</option>
                  <option value={true}>Sudah Pulang</option>s
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <HiOutlineSelector />
                </div>
              </div>
              <div>
                {/* Filter tanggal */}
                <input
                  type="date"
                  value={this.state.tanggalFilter}
                  onChange={this.handleTanggalFilterChange}
                  className={
                    this.state.isSudahPulang
                      ? `block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md leading-tight focus:outline-none focus:border-gray-500`
                      : `hidden`
                  }
                />
              </div>
            </div>
            <div className="flex flex-col pb-10 px-7">
              {this.state.isSudahPulang ? (
                <MUIDataTable
                  title={"Data Kepulangan"}
                  data={dataPulang}
                  columns={columnsPulang}
                  options={options}
                />
              ) : (
                <MUIDataTable
                  title={"Data Kehadiran"}
                  data={dataHadir}
                  columns={columnsHadir}
                  options={options}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Kehadiran;
