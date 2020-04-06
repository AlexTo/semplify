package modules.project.controllers

import javax.inject.{Inject, Singleton}
import modules.project.models.ProjectCreate
import modules.project.services.ProjectService
import modules.security.services.ProfileService
import modules.triplestore.services.RepositoryService
import play.api.libs.json.{JsValue, Json}
import play.api.mvc._

import scala.concurrent.ExecutionContext

@Singleton
class ProjectController @Inject()(projectService: ProjectService,
                                  profileService: ProfileService,
                                  repositoryManager: RepositoryService,
                                  cc: ControllerComponents)
                                 (implicit ec: ExecutionContext) extends AbstractController(cc) {

  def create: Action[JsValue] = Action.async(parse.json) { request: Request[JsValue] =>

    val profile = profileService.getProfile(request).get

    val json = request.body
    val project = json.as[ProjectCreate]
    projectService.create(project, profile.getUsername)
      .map(model => Ok(Json.toJson(model)))
      .recover(_ => InternalServerError)
  }
}