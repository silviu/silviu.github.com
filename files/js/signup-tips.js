$(document).ready(function(){
            $(".formContainer input[type=text]").focus(function(){
                $(this).parent().find(".error").css("display", "none");
                $(this).parent().find(".info").css("display", "block");
            }).blur(function(){
                $(this).parent().find(".info").css("display", "none");
            });
        });
        $(document).ready(function(){
            $(".formContainer input[type=password]").focus(function(){
                $(this).parent().find(".error").css("display", "none");
                $(this).parent().find(".info").css("display", "block");
            }).blur(function(){
                $(this).parent().find(".info").css("display", "none");
            });
        });
        
        function validateForm()
        {
            $(".formContainer input[type=text]").each(function(){
                var text = $(this).attr("value");
                if (text == "")
                {
                    $(this).parent().find(".error").css("display", "block");
                }
            });
 
        
            $(".formContainer input[type=password]").each(function(){
                var text = $(this).attr("value");
                if (text == "")
                {
                    $(this).parent().find(".error").css("display", "block");
                }
            });
        }
        
        function clearForm()
        {
            $(".formContainer input[type=text]").each(function(){
                $(this).parent().find(".error").css("display", "none");
            });
       }
