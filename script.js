// إعداد Firebase
const firebaseConfig = {
  apiKey: "ضع هنا الـ API Key",
  authDomain: "ضع هنا الـ authDomain",
  databaseURL: "ضع هنا رابط قاعدة البيانات",
  projectId: "ضع هنا الـ projectId",
  storageBucket: "ضع هنا الـ storageBucket",
  messagingSenderId: "ضع هنا الـ messagingSenderId",
  appId: "ضع هنا الـ appId"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// إضافة عميل جديد
function addClient() {
  const client = {
    name: document.getElementById('clientName').value,
    phone: document.getElementById('phone').value,
    service: document.getElementById('service').value,
    status: document.getElementById('status').value,
    payment: parseFloat(document.getElementById('payment').value) || 0,
    comment: document.getElementById('comment').value,
    responsible: document.getElementById('responsible').value
  };

  db.ref('clients').push(client);
  clearInputs();
}

// مسح القيم بعد الإضافة
function clearInputs() {
  document.getElementById('clientName').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('service').value = '';
  document.getElementById('status').value = '';
  document.getElementById('payment').value = '';
  document.getElementById('comment').value = '';
  document.getElementById('responsible').value = '';
}

// عرض البيانات وحساب إجمالي الدفع
db.ref('clients').on('value', snapshot => {
  const table = document.querySelector('#clientsTable tbody');
  table.innerHTML = '';
  let total = 0;

  snapshot.forEach(childSnapshot => {
    const client = childSnapshot.val();
    total += client.payment || 0;
    const row = `<tr>
      <td>${client.name}</td>
      <td>${client.phone}</td>
      <td>${client.service}</td>
      <td>${client.status}</td>
      <td>${client.payment}</td>
      <td>${client.comment}</td>
      <td>${client.responsible}</td>
    </tr>`;
    table.innerHTML += row;
  });

  document.getElementById('totalPayment').innerText = total;
});

// تنزيل البيانات كملف CSV
function downloadCSV() {
  db.ref('clients').once('value', snapshot => {
    let csv = 'اسم العميل,رقم التليفون,الخدمة,حالة الخدمة,الدفع,تعليق,المسؤول\n';
    snapshot.forEach(childSnapshot => {
      const client = childSnapshot.val();
      csv += `"${client.name}","${client.phone}","${client.service}","${client.status}",${client.payment},"${client.comment}","${client.responsible}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'clients_data.csv';
    link.click();
  });
}
