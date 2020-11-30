<?php
if(!isset($_POST['submit']))
{
    //This page should not be accessed directly. Need to submit the from.
    echo "error; you need to submit the form!";
}

$nome = $_POST['nome'];
$email_visitante = $_POST['email'];
$mensagem = $_POST['mensagem'];

//Validate  first
if(empty($nome)||empty($email_visitante))
{
    echo "Nome e email são obrigatórios!";
    exit;
}

$email_from = 'pedroscheck@hotmail.com'; //<== por o seu email aqui
$email_subject = "Nova mensagem do form";
$email_body = "Você recebeu uma nova mensagem de $nome.\n".
    "email address: $visitor_email\n".
    "Aqui está a mensagem:\n $mensagem".

$to = "pedroscheck@hotmail.com"; //<== por o seu email aqui
$headers = "From: $email_from \r\n";
$headers .= "Reply-To: $email_visitante \r\n";

//validação contra injeções de spammers
function IsInjected($str)
{
    $injections = array('(\n+)',
           '(\r+)',
           '(\t+)',
           '(%0A+)',
           '(%0D+)',
           '(%08+)',
           '(%09+)'
           );
               
    $inject = join('|', $injections);
    $inject = "/$inject/i";
    
    if(preg_match($inject,$str))
    {
      return true;
    }
    else
    {
      return false;
    }
}

if(IsInjected($visitor_email))
{
    echo "Bad email value!";
    exit;
}

//send the email
mail($to,$email_subject,$email_body,$headers);
?>


