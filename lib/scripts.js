function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

jQuery(document).ready(function($) {
    var inputManual = $("#inputManualSenha");
    let historicoSenhas = [];

    function atualizaHistoricoSenha(senha) {
        historicoSenhas.unshift(senha);
        if (historicoSenhas.length > 4) historicoSenhas.pop();
        $("#ultimaSenhaHistorico").html(historicoSenhas.join(" &nbsp;|&nbsp; "));
    }

    $("body").on('keydown', function(e) {
        var senhaAtual   = $("#senhaAtualNumero");
        var senhaNormal  = $("#senhaNormal");
        var senhaPrior   = $("#senhaPrioridade");
        var audioChamada = $("#audioChamada");

        // Se o campo manual estiver visível, tratamos apenas Enter ou Esc
        if (inputManual.is(":visible")) {
            if (e.key === "Enter") {
                var valor = inputManual.val().toUpperCase().trim();
                if (valor.match(/^P\d{1,3}$/)) {
                    var s = parseInt(valor.replace("P", ""));
                    senhaAtual.html("P" + pad(s, 3));
                    senhaPrior.val("P" + pad(s, 3));
                } else if (valor.match(/^\d{1,4}$/)) {
                    var s = parseInt(valor);
                    senhaAtual.html(pad(s, 4));
                    senhaNormal.val(pad(s, 4));
                }
                atualizaHistoricoSenha(senhaAtual.html());
                audioChamada.trigger("play");
                inputManual.val("").hide();
            }
            if (e.key === "Escape") {
                inputManual.val("").hide();
            }
            return;
        }

        if (e.keyCode === 39) { // → Avança senha normal
            atualizaHistoricoSenha(senhaAtual.html());
            var senha = parseInt(senhaNormal.val()) + 1;
            senhaAtual.html(pad(senha, 4));
            senhaNormal.val(pad(senha, 4));
            audioChamada.trigger("play");
        }

        if (e.keyCode === 37) { // ← Volta senha normal
            var senha = parseInt(senhaNormal.val()) - 1;
            senhaAtual.html(pad(senha, 4));
            senhaNormal.val(pad(senha, 4));
        }

        if (e.keyCode === 38) { // ↑ Avança prioridade
            atualizaHistoricoSenha(senhaAtual.html());
            var senha = parseInt(senhaPrior.val().replace("P", "")) + 1;
            senhaAtual.html("P" + pad(senha, 3));
            senhaPrior.val("P" + pad(senha, 3));
            audioChamada.trigger("play");
        }

        if (e.keyCode === 40) { // ↓ Volta prioridade
            var senha = parseInt(senhaPrior.val().replace("P", "")) - 1;
            senhaAtual.html("P" + pad(senha, 3));
            senhaPrior.val("P" + pad(senha, 3));
        }

        if (e.key === "Shift") { // Ativa entrada manual
            inputManual.show().focus();
        }
    });
});

