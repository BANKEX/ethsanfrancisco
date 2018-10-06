function CloseAlert(arg) {
    switch (arg) {
        case 0:
            document.getElementById("Error_pop").style.display = 'none';
            break;
        case 1:
            document.getElementById("Success_pop").style.display = 'none';
            break;
        default:
            break;
    }
}

function openLoader() {
    $(".loader").show();
}

function closeLoader() {
    $(".loader").hide();
}

function addError(errorText) {
    document.getElementById('container').innerHTML = ` 
    <div class="alert alert-danger col-12" id="Error_pop">
        <div class="row">
            <div class="col-10">
                <h2>Error</h2>
                <h5>${errorText}</h5>
            </div>
            <div class="col-2">
                <button type="button" class="close" onclick="CloseAlert(0)">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    </div>`;
}

function addHint(errorText) {
    document.getElementById('container').innerHTML += ` 
    <div class="alert alert-danger col-12" id="Error_pop">
        <div class="row">
            <div class="col-10">
                <h2>Error</h2>
                <h5>${errorText}</h5>
            </div>
            <div class="col-2">
                <button type="button" class="close" onclick="CloseAlert(0)">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    </div>`;
}