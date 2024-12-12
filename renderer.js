const drag = document.getElementById('drag');

drag.addEventListener('click', async () => {

  console.log('111111111111111')

  const filePath = await window.electronAPI.pickFile();
  console.log(filePath)
})
