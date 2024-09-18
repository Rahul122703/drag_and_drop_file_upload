const drop_here = document.querySelector(".drop_here");
const uploading_list = document.querySelector(".uploading_list");
const list_container = document.querySelector(".files_container");
const file_selector = document.querySelector(".browser_text");
const file_selector_input = document.querySelector("#browser_button");

file_selector.onclick = () => file_selector_input.click();

file_selector_input.onchange = () => {
  [...file_selector_input.files].forEach((file) => {
    if (check_file_validation(file.type)) {
      console.log(file);
      upload_file(file);
    }
  });
};

check_file_validation = (file_type) => {
  const file_format = file_type.split("/")[0];
  if (
    file_format == "image" ||
    file_format == "video" ||
    file_type == "application/pdf"
  ) {
    return true;
  }
};

drop_here.ondragover = (event) => event.preventDefault();

//here
drop_here.ondrop = (event) => {
  event.preventDefault();
  console.log([...event.dataTransfer.items]);
  if (event.dataTransfer.items) {
    [...event.dataTransfer.items].forEach((currentItem) => {
      if (currentItem.kind === "file") {
        const current_file = currentItem.getAsFile();
        if (check_file_validation(current_file.type)) {
          upload_file(current_file);
        }
      } else {
        [...event.dataTransfer.files].forEach((currentItem) => {
          if (check_file_validation(currentItem)) {
            upload_file(currentItem);
          }
        });
      }
    });
  }
};

let uploading_file_counter = 0;

upload_file = (file) => {
  uploading_file_counter++;
  uploading_list.style.display = "flex";
  list_container.innerHTML += `
                    <li class="file_info uploading" id = "uploading_file_no_${uploading_file_counter}">
                        <div class="icon_container">
                            <img
                                src="${select_icon(file)}"
                                class="file_icon">
                        </div>
                        <div class="colmun">
                            <div class="file_name">
                                <div class="name">${file.name}</div>
                                <span>0%</span>
                            </div>
                            <div class="file_progress">
                                <span></span>
                            </div>
                            <div class="file_size">${(
                              file.size /
                              (1024 * 1024)
                            ).toFixed(2)} MB</div>
                        </div>
                        <div class="right_cross">
                            <div class="right_emoji">✅</div>
                            <div class="cross_emoji">❌</div>
                        </div>
                    </li>
`;

  let http = new XMLHttpRequest();
  let data = new FormData();
  const current_uploading_file = document.querySelector(
    `#uploading_file_no_${uploading_file_counter}`
  );
  console.log(current_uploading_file);
  data.append("file", file);
  http.onload = () => {
    current_uploading_file.classList.add("uploaded");
    current_uploading_file.classList.remove("uploading");
  };
  http.upload.onprogress = (event) => {
    let percentage = (event.loaded / event.total) * 100;
    current_uploading_file.querySelectorAll("span")[0].innerHTML =
      Math.round(percentage) + "%";
    current_uploading_file.querySelectorAll("span")[1].style.width =
      percentage + "%";
  };

  http.open("POST", "sender.php", true);
  http.send(data);
  current_uploading_file.querySelector(".cross_emoji").onclick = () =>
    http.abort();
  http.onabort = () => current_uploading_file.remove();
};

select_icon = (file) => {
  const splitType =
    file.type.split("/")[0] == "application"
      ? "application"
      : file.type.split("/")[0];
  return splitType + ".png";
};
