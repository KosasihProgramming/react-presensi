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
    };
  }

  componentDidMount = () => {
    this.getKehadiran();
  };

  getKehadiran = () => {
    axios
      .get(`${urlAPI}/kehadiran/${this.state.idKehadiran}`)
      .then((response) => {
        const data = response.data[0];

        console.log("axios: ", data.barcode);
        console.log("Inputan: ", this.state.barCode);

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
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      barCode,
      idKehadiran,
      idJadwal,
      idDetailJadwal,
      idShift,
      fotoKeluar,
      jamPulang,
      jamKeluar,
      durasi,
      lembur,
    } = this.state;

    axios
      .get(`${urlAPI}/kehadiran/${this.state.idKehadiran}`)
      .then((response) => {
        const data = response.data[0];
        const barcode = data.barcode;

        if (barcode != barCode) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Barcode yang dimasukkan tidak sesuai",
          });
        } else {
          const fotoKeluar = this.webcamRef.current.getScreenshot();
          const waktuSekarang = new Date();
          const jamKeluar = konfersiJam(waktuSekarang.toLocaleTimeString());

          axios
            .patch(`${urlAPI}/kehadiran/${idKehadiran}`, {
              foto_keluar: fotoKeluar,
              jam_keluar: jamKeluar,
            })
            .then((response) => {
              Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data berhasil diperbarui",
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

    // const waktuSekarang = new Date();
    // this.state.jamMasuk = konfersiJam(waktuSekarang.toLocaleTimeString());
    // const foto_pulang = this.webcamRef.current.getScreenshot();

    // const presensiPulang = {
    //   id_jadwal: idJadwal,
    //   id_detail_jadwal: idDetailJadwal,
    //   id_shift: idShift,
    //   foto_keluar: foto_pulang,
    // };

    // axios
    //   .get(urlAPI + `/kehadiran/${idKehadiran}`)
    //   .then((response) => {
    //     if (response.data.barcode === this.state.barCode) {
    //       // Jika tidak ada data yang sesuai dengan idKehadiran
    //       Swal.fire({
    //         icon: "error",
    //         title: "Gagal",
    //         text: "ID Kehadiran tidak ditemukan",
    //       });
    //     } else {
    //       // Jika ada data yang sesuai dengan idKehadiran, lakukan permintaan PATCH
    //       axios
    //         .patch(urlAPI + `/kehadiran/${idKehadiran}`, {
    //           id_jadwal: idJadwal,
    //           id_detail_jadwal: idDetailJadwal,
    //           id_shift: idShift,
    //           foto_keluar: foto_pulang,
    //         })
    //         .then((response) => {
    //           Swal.fire({
    //             icon: "success",
    //             title: "Berhasil",
    //             text: "Data berhasil diperbarui",
    //           });
    //         })
    //         .catch((err) => {
    //           Swal.fire({
    //             icon: "error",
    //             title: "Gagal",
    //             text: `${err}`,
    //           });
    //         });
    //     }
    //   })
    //   .catch((err) => {
    //     // Jika idKehadiran tidak ada di database, tampilkan pesan kesalahan dengan SweetAlert
    //     Swal.fire({
    //       icon: "error",
    //       title: "Gagal",
    //       text: "Terjadi kesalahan saat memuat data",
    //     });
    //   });
  };

  render() {
    return (
      <div>
        <div className="card-presensi">
          <div className="rounded-lg bg-white shadow-lg">
            <div className="grid grid-cols-2">
              <div className="flex p-10 h-[70vh] justify-center items-center">
                <Webcam
                  audio={false}
                  ref={this.webcamRef}
                  screenshotFormat="image/jpeg"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="title">Presensi pulang</h4>
                <p>Nama Doketer: Nama dokter</p>
                <p>Jadwal: jadwla</p>
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
                        onClick={this.handleSubmit}>
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
