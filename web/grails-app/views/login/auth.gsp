<html>
<head>
    <r:require modules="bootstrap"/>
	<meta name='layout' content='bootstrap'/>

    <title>Urbo login</title>
</head>

<body>
    <div class='row'>
        <div class='span4 offset3'>
            <div class="page-header">
                <h1><g:message code="springSecurity.login.header"/></h1>
            </div>

            <g:if test='${flash.message}'>
                <div class="alert">
                    <button class="close" data-dismiss="alert">×</button>
                    ${flash.message}
                </div>
            </g:if>

            <form action='${postUrl}' method='POST' id='loginForm' class='  well' autocomplete='off'>

                    <label for='username'><g:message code="springSecurity.login.username.label"/>:</label>
                    <input type='text' class='span3' name='j_username' id='username'/>



                    <label for='password'><g:message code="springSecurity.login.password.label"/>:</label>
                    <input type='password' class='span3' name='j_password' id='password'/>


                    <label class='checkbox'>
                        <input type='checkbox' name='${rememberMeParameter}' id='remember_me' <g:if test='${hasCookie}'>checked='checked'</g:if>/> <g:message code="springSecurity.login.remember.me.label"/>
                    </label>
                    <div class='btn-group'>
                        <button type='submit' class='btn btn-primary' id="submit">${message(code: "springSecurity.login.button")}</button>
                    </div>
            </form>
        </div>

        <script type='text/javascript'>
            <!--
            (function() {
                document.forms['loginForm'].elements['j_username'].focus();
            })();
            // -->
        </script>
    </div>
</body>
</html>
