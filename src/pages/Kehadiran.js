import axios from "axios";
import MUIDataTable from "mui-datatables";
import { Component } from "react";
import { urlAPI } from "../config/Global";
import { Link } from "react-router-dom";

class Kehadiran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataKehadiran: [],
    };
  }

  componentDidMount = () => {
    this.getAllDataKehadiran();
  };

  getAllDataKehadiran = () => {
    axios
      .get(urlAPI + "/kehadiran/now")
      .then((response) => {
        this.setState({ dataKehadiran: response.data });
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  render() {
    const datas = this.state.dataKehadiran.map((data) => {
      const masukDate = new Date(data.jam_masuk);

      const tanggal = masukDate.getDate();
      const bulan = masukDate.getMonth() + 1;
      const tahun = masukDate.getFullYear();
      const jam = masukDate.getHours();
      const menit = masukDate.getMinutes();
      const detik = masukDate.getSeconds();

      const formatTanggal = `${tanggal}-${bulan}-${tahun}`;
      const formatJam = `${jam}:${menit}:${detik}`;

      const masukTime = `${formatTanggal}, ${formatJam}`;

      const keluar = data.foto_keluar;

      return [
        data.barcode,
        data.id_shift,
        masukTime,
        <img
          className="w-24 rounded-full"
          src={`${urlAPI}/uploads/${data.foto_masuk}`}
          alt={data.foto_masuk}
        />,
      ];
    });

    const columns = [
      "Nama Dokter",
      "Detail Jadwal (ID)",
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

    const options = {
      selectableRows: false,
      elevation: 0,
      rowsPerPage: 10,
      rowsPerPageOption: [5, 10],
    };

    return (
      <>
        <div className="container mx-auto mb-16 mt-5 ">
          <div className="rounded-lg bg-white shadow-lg">
            <div className="flex flex-col p-10">
              <MUIDataTable
                title={"Data Kehadiran"}
                data={datas}
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

export default Kehadiran;
