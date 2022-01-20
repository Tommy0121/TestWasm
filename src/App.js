import "./App.css";
import { useEffect, useState } from "react";
import init,{optimise} from './squoosh_oxipng'

function App() {
  const [previewUrl, setPreviewUrl] = useState(null);
  useEffect(() => {
    const eleFile = document.querySelector("#file");
    const fileReader = new FileReader();
    eleFile.addEventListener("change", function (event) {
      const file = event.target.files[0];
      // 选择的文件是图片
      if (file.type.indexOf("image") === 0) {
        fileReader.readAsArrayBuffer(file);
      }
    });
    fileReader.onload = (e) => {
      const uintArray = new Uint8Array(e.target.result);
       init('./squoosh_oxipng_bg.wasm').then(results=>{
        const resultBuffer = optimise(uintArray, 6,false);
        const blob = new Blob([resultBuffer], { type: "image/png" });
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(blob);
        setPreviewUrl(imageUrl);
       })
      // WebAssembly.instantiateStreaming(fetch("./squoosh_oxipng_bg.wasm"),{}).then(
      //   (results) => {
      //     // Do something with the results!
          // const resultBuffer = results.module.optimise(uintArray, 7);
          // const blob = new Blob([resultBuffer], { type: "image/png" });
          // const urlCreator = window.URL || window.webkitURL;
          // const imageUrl = urlCreator.createObjectURL(blob);
          // setPreviewUrl(imageUrl);
      //   }
      // );
    };
  }, []);
  return (
    <div>
      <input id="file" type="file" />
      {previewUrl ? <img alt="" src={previewUrl} /> : null}
    </div>
  );
}

export default App;
