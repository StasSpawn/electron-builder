const drag = document.getElementById('drag');
const loader = document.getElementById('loader');
const filePathElement = document.getElementById('filePath');
const filePathText = document.getElementById('filePathText');
const buttonOpenFolder = document.getElementById('buttonOpenFolder');
const pythonModalError = document.getElementById('python-modal-error');
const pythonModalErrorButton = document.getElementById('python-modal-error-button');

const allLinks = document.querySelectorAll('.linkBlank');
for (let i = 0; i < allLinks.length; i++) {
  if (allLinks[i].attributes.dataLink.value) {
    allLinks[i].addEventListener('click', async () => {
      await window.electronAPI.openLinkInBrowser(allLinks[i].attributes.dataLink.value);
    });
  }
}
// function for check installed python
const checkPython = async () => {
  const pythonCheckStatus = await window.electronAPI.checkPython();

  if (!pythonCheckStatus) {
    pythonModalError.classList.remove("hidden");
  }
};

// check python after load window
document.addEventListener('DOMContentLoaded', async function () {
  checkPython();
}, false);

// check python after click in modal
pythonModalErrorButton.addEventListener('click', async () => {
  checkPython();
});


let currentFileName = '';

let resultStatus = '';


// open select file windows after click on drag block
drag.addEventListener('click', async () => {
  loader.classList.remove("hidden");
  const filePath = await window.electronAPI.pickFile();

  if (filePath) {
    currentFileName = filePath.result;
    filePathText.innerText = filePath.result;
    resultStatus = filePath.status;

    if (resultStatus !== 'error') {
      buttonOpenFolder.classList.remove("hidden");
    }
    filePathElement.classList.remove("hidden");

  }
  loader.classList.add("hidden");
});


// open folder with new file after click
buttonOpenFolder.addEventListener('click', async () => {
  await window.electronAPI.openFolderWithFile(currentFileName);
});


// drag n drop Document
document.addEventListener('dragover', (e) => {
  e.stopPropagation();
  e.preventDefault();
  drag.classList.add("active");

});

document.addEventListener('dragleave', (e) => {
  e.stopPropagation();
  e.preventDefault();
  drag.classList.remove("active");
});

// drag n drop Drag block
drag.addEventListener('dragover', (e) => {
  e.stopPropagation();
  e.preventDefault();
});

drag.addEventListener('drop', async (e) => {
  e.stopPropagation();
  e.preventDefault();
  loader.classList.remove("hidden");

  const filePath = await window.electronAPI.pickFile(e.dataTransfer.files[0].name);
  filePathText.innerText = filePath;
  currentFileName = filePath.result;
  filePathText.innerText = filePath.result;
  resultStatus = filePath.status;

  if (resultStatus !== 'error') {
    buttonOpenFolder.classList.remove("hidden");
  }

  if (filePath) {
    filePathElement.classList.remove("hidden");
    loader.classList.add("hidden");
  }
});
