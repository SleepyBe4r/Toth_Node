
class Admin_Controller {

    home_view(req, resp){
        resp.render("admin/admin_home_view.ejs", { layout: "layout_admin_home.ejs"});
    }
}

module.exports = Admin_Controller;