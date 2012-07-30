class UrlMappings {

	static mappings = {
		"/$controller/$action?/$id?"{
			constraints {
				// apply constraints here
			}
		}

        "/admin/case"(controller: "feedback")
        "/admin/author"(controller:  "author")

        "/api/v1/case"(controller: "apiFeedback") {
            action = [GET: "findAll", POST: "save"]
        }

        "/api/v1/uploadPhoto"(controller: "apiFeedback", action: "uploadPhoto")

        //"/api/v1/case/new"(controller: "feedback", action: "save")

        "/api/v1/case/$id"(controller: "apiFeedback", action: "findById")

        "/api/v1/"(controller: "apiHelp")

		"/"(view:"/index")
		"500"(view:'/error')
	}
}
