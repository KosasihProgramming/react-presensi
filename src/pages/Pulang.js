import axios from "axios";
import React, { Component } from "react";
import Webcam from "react-webcam";
import { urlAPI } from "../config/Global";
import withRouter from "../withRouter";
import { Link } from "react-router-dom";
import { konfersiJam } from "../function/konfersiJam";
import Swal from "sweetalert2";

class Pulang extends Component {
  constructor(props) {
    super(props);
    this.webcamRef = React.createRef();
    const { id_kehadiran } = this.props.params;
    this.state = {
      dataPulang: [],
      idKehadiran: id_kehadiran,
      barCode: 0,
      idJadwal: 0,
      idDetailJadwal: 0,
      idShift: 0,
      fotoMasuk: "",
      fotoKeluar: "",
      jamMasuk: "",
      jamKeluar: "",
      durasi: 0,
      telat: 0,
      dendaTelat: 0,
      isPindahKlinik: 1,
      lembur: 0,
      namaDokter: "",
      namaShift: "",
      isProses: false,
    };
  }

  componentDidMount = () => {
    this.getKehadiran();
    this.getNamaDokter();
  };

  getKehadiran = () => {
    axios
      .get(`${urlAPI}/kehadiran/${this.state.idKehadiran}`)
      .then((response) => {
        const data = response.data[0];

        this.setState({
          barCode: data.barcode,
          idJadwal: data.id_jadwal,
          idDetailJadwal: data.id_detail_jadwal,
          idShift: data.id_shift,
          fotoMasuk: data.foto_masuk,
          fotoKeluar: data.foto_keluar,
          jamMasuk: data.jam_masuk,
          jamKeluar: data.jam_keluar,
          durasi: data.durasi,
          telat: data.telat,
          dendaTelat: data.denda_telat,
          isPindahKlinik: data.is_pindah_klinik,
          lembur: data.lembur,
          namaShift: data.nama_shift,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  getNamaDokter = () => {
    axios
      .get(`${urlAPI}/barcode/dokter/${this.state.idKehadiran}`)
      .then((response) => {
        const dataDokter = response.data[0];

        console.log(dataDokter);

        this.setState({
          namaDokter: dataDokter.nama,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  handleSubmit = (e) => {
    this.setState({ isProses: true });
    e.preventDefault();
    const {
      barCode,
      idKehadiran,
      idJadwal,
      idDetailJadwal,
      idShift,
      fotoKeluar,
      jamMasuk,
      jamKeluar,
      durasi,
      lembur,
    } = this.state;

    axios
      .get(`${urlAPI}/kehadiran/${this.state.idKehadiran}`)
      .then((response) => {
        const data = response.data[0];
        const barcode = data.barcode;

        console.log("data: ", data);

        if (barcode != barCode) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Barcode yang dimasukkan tidak sesuai",
          });
        } else {
          const fotoKeluar = this.webcamRef.current.getScreenshot();
          const waktuSekarang = new Date(); //jam pulang
          const jamKeluar = konfersiJam(waktuSekarang.toLocaleTimeString());

          axios
            .patch(`${urlAPI}/kehadiran/${idKehadiran}`, {
              foto_keluar: fotoKeluar,
              jam_masuk: this.state.jamMasuk,
              jam_keluar: jamKeluar,
            })
            .then((response) => {
              Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Berhasil melakukan presensi pulang",
              }).then((result) => {
                if (result.value) {
                  window.location.href = `/kehadiran`;
                }
              });
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan saat menyimpan data",
              });
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    return (
      <div>
        <div className="card-presensi">
          <div className="rounded-lg bg-white shadow-lg">
            <div className="grid grid-cols-2">
              <div className="flex p-10 h-[70vh] justify-center items-center">
                <Webcam
                  className="rounded-3xl"
                  audio={false}
                  ref={this.webcamRef}
                  screenshotFormat="image/jpeg"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="title">Presensi pulang</h4>
                <p className="text-xl">
                  Nama Doketer:{" "}
                  <span className="font-bold">{this.state.namaDokter}</span>
                </p>
                <p className="text-xl mb-5">
                  Shift:{" "}
                  <span className="font-bold">{this.state.namaShift}</span>
                </p>
                <form action="">
                  <div className="flex flex-col gap-4 w-[60%]">
                    <input
                      type="number"
                      onChange={(e) => {
                        this.setState({ barCode: e.target.value });
                      }}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-500"
                    />
                    <div className="flex flex-row gap-4">
                      <Link
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                        to={"/kehadiran"}>
                        Batal
                      </Link>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                        onClick={this.handleSubmit}
                        disabled={this.state.isProses}>
                        Pulang
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Pulang);
