

// ===== Generic File Upload Handler =====
function setupFileUpload(inputId, prevId, phId, targets) {
    document.getElementById(inputId).addEventListener('change', function(e) {
        var file = e.target.files[0]; if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
            var url = ev.target.result;
            document.getElementById(prevId).src = url;
            document.getElementById(prevId).style.display = 'block';
            document.getElementById(phId).style.display = 'none';
            targets.forEach(function(t) {
                document.getElementById(t.img).src = url;
                document.getElementById(t.img).style.display = 'block';
                if (t.ghost) document.getElementById(t.ghost).style.display = 'none';
            });
        };
        reader.readAsDataURL(file);
    });
}

// Airport Logo — syncs front + back
setupFileUpload('sktLogoInput', 'sktLogoPrev', 'sktLogoPH', [
    { img: 'fSktImg', ghost: 'fSktGhost' },
    { img: 'bSktImg', ghost: 'bSktGhost' }
]);

// Company Logo — front only
setupFileUpload('gaLogoInput', 'gaLogoPrev', 'gaLogoPH', [
    { img: 'fGaImg', ghost: 'fGaGhost' }
]);

// Profile Photo — direct upload, no crop
setupFileUpload('photoInput', 'photoPrev', 'photoPH', [
    { img: 'fPhoto', ghost: 'fNoPhoto' }
]);

// Signature
setupFileUpload('sigInput', 'sigPrev', 'sigPH', [
    { img: 'fSig', ghost: null }
]);

// ===== Utilities =====
function formatDate(d) { if (!d) return '—'; var dt = new Date(d); return dt.getDate() + '/' + (dt.getMonth() + 1) + '/' + dt.getFullYear(); }

function generateBarcode() {
    var id = document.getElementById('empID').value.trim() || '0'; var name = document.getElementById('empName').value.trim() || 'N/A';
    var cnic = document.getElementById('empCNIC').value.trim() || 'N/A'; var dept = document.getElementById('empDept').value.trim() || 'N/A';
    var co = document.getElementById('companyName').value.trim() || 'N/A';
    try { JsBarcode('#barcodeSVG', 'EMP:'+id+'|NAME:'+name+'|CNIC:'+cnic+'|DEPT:'+dept+'|CO:'+co, { format:'CODE128',width:1.8,height:45,displayValue:true,fontSize:8,font:'Poppins',textMargin:3,margin:5,background:'transparent' }); } catch(e) { console.error(e); }
}

function generateCard() {
    var name = document.getElementById('empName').value.trim();
    if (!name) { showToast('Please enter employee name!','error'); document.getElementById('empName').focus(); return; }
    var comp = document.getElementById('companyName').value.trim();
    document.getElementById('fCompName').textContent = comp || 'Company Name'; document.getElementById('bCompName').textContent = comp || 'Company Name';
    document.getElementById('fName').textContent = name;
    document.getElementById('fDesig').textContent = document.getElementById('empDesignation').value.trim() || 'Designation';
    document.getElementById('fDept').textContent = document.getElementById('empDept').value.trim() || 'Department';
    document.getElementById('fEmpID').textContent = document.getElementById('empID').value.trim() || '—';
    document.getElementById('fFather').textContent = document.getElementById('fatherName').value.trim() || '—';
    document.getElementById('fCNIC').textContent = document.getElementById('empCNIC').value.trim() || '—';
    document.getElementById('fDOB').textContent = formatDate(document.getElementById('empDOB').value);
    document.getElementById('fPhone').textContent = document.getElementById('empPhone').value.trim() || '—';
    document.getElementById('fExpiry').textContent = formatDate(document.getElementById('empExpiry').value);
    generateBarcode(); showToast('Both sides generated with barcode!','success');
}

function resetForm() {
    ['empName','empID','fatherName','empDept','empDesignation','empDOB','empCNIC','empPhone','empExpiry','companyName'].forEach(function(id){document.getElementById(id).value='';});
    ['sktLogoInput','gaLogoInput','photoInput','sigInput'].forEach(function(id){document.getElementById(id).value='';});
    ['sktLogoPrev','gaLogoPrev','photoPrev','sigPrev'].forEach(function(id){var el=document.getElementById(id);el.src='';el.style.display='none';});
    ['sktLogoPH','gaLogoPH','photoPH','sigPH'].forEach(function(id){document.getElementById(id).style.display='block';});
    ['fSktImg','fGaImg','fPhoto','fSig'].forEach(function(id){var el=document.getElementById(id);el.src='';el.style.display='none';});
    ['fSktGhost','fGaGhost','fNoPhoto'].forEach(function(id){document.getElementById(id).style.display='block';});
    document.getElementById('bSktImg').src=''; document.getElementById('bSktImg').style.display='none'; document.getElementById('bSktGhost').style.display='block';
    document.getElementById('fCompName').textContent='Company Name'; document.getElementById('bCompName').textContent='Company Name';
    document.getElementById('fName').textContent='Your Name'; document.getElementById('fDesig').textContent='Designation'; document.getElementById('fDept').textContent='Department';
    ['fEmpID','fFather','fCNIC','fDOB','fPhone','fExpiry'].forEach(function(id){document.getElementById(id).textContent='—';});
    document.getElementById('barcodeSVG').innerHTML='';
    showToast('Form Reset!','info');
}

function printCard() { window.print(); }


function showToast(msg, type) {
    var t=document.getElementById('toast'),m=document.getElementById('toastMsg'),ic=t.querySelector('i');
    m.textContent=msg;
    if(type==='error'){ic.className='fas fa-exclamation-circle';ic.style.color='#e74c3c';t.style.borderColor='#e74c3c';}
    else if(type==='info'){ic.className='fas fa-info-circle';ic.style.color='var(--gold)';t.style.borderColor='var(--gold)';}
    else{ic.className='fas fa-check-circle';ic.style.color='var(--success)';t.style.borderColor='var(--success)';}
    t.classList.add('show');
    setTimeout(function(){t.classList.remove('show');},3000);
}

// Live Preview
var liveFields=[{i:'empName',c:'fName',f:'Your Name'},{i:'empDesignation',c:'fDesig',f:'Designation'},{i:'empDept',c:'fDept',f:'Department'},{i:'empID',c:'fEmpID',f:'—'},{i:'fatherName',c:'fFather',f:'—'},{i:'empCNIC',c:'fCNIC',f:'—'},{i:'empPhone',c:'fPhone',f:'—'}];
liveFields.forEach(function(x){document.getElementById(x.i).addEventListener('input',function(){document.getElementById(x.c).textContent=this.value.trim()||x.f;});});
document.getElementById('companyName').addEventListener('input',function(){var v=this.value.trim()||'Company Name';document.getElementById('fCompName').textContent=v;document.getElementById('bCompName').textContent=v;});
document.getElementById('empDOB').addEventListener('change',function(){document.getElementById('fDOB').textContent=formatDate(this.value);});
document.getElementById('empExpiry').addEventListener('change',function(){document.getElementById('fExpiry').textContent=formatDate(this.value);});


//

function printCard() {
    // Agar Electron app hai toh OS ka dialog kholo, warna browser ka print
    if (window.electronAPI) {
        window.electronAPI.printCard();
    } else {
        window.print();
    }
}async function downloadCard() {

    const cardsWrapper = document.querySelector('.cards-wrapper');

    if (!cardsWrapper) {
        showToast('Cards not found!', 'error');
        return;
    }

    showToast('Generating PDF...', 'info');

    // PDF layout fix
    cardsWrapper.style.display = 'flex';
    cardsWrapper.style.flexDirection = 'column';
    cardsWrapper.style.alignItems = 'center';

    cardsWrapper.style.width = '53.98mm';

    cardsWrapper.style.margin = '0';
    cardsWrapper.style.padding = '0';
    cardsWrapper.style.gap = '0';

    // page break
    document.getElementById('frontCard').style.pageBreakAfter = 'always';

    // wait fonts/images
    await document.fonts.ready;

    const opt = {

        margin: 0,

        filename: 'employee-id-cards.pdf',

        image: {
            type: 'jpeg',
            quality: 1
        },

        html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        },

        jsPDF: {
            unit: 'mm',
            format: [53.98, 85.6],
            orientation: 'portrait'
        },

        pagebreak: {
            mode: ['css', 'legacy']
        }
    };

    await html2pdf()
        .set(opt)
        .from(cardsWrapper)
        .save();

    showToast('PDF Downloaded!', 'success');
}