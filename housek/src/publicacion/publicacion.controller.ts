// @ts-ignore
import {
    Body,
    Controller,
    FilesInterceptor,
    Get,
    Param,
    Post,
    Query,
    Res,
    Session, UploadedFiles,
    UseInterceptors
} from "@nestjs/common";
import {PublicacionService} from "./publicacion.service";
import {ComprasService} from "../compras/compras.service";
import {extname} from "path";

@Controller('Publicacion')
export class PublicacionController {
    constructor(
        private readonly _publicacionService: PublicacionService,
        private readonly _compraService:ComprasService,
    ){

    }

    @Get('saludo')
    saludo():String{
        return 'Hola estas en la publicacion'
    }

    // Ver las publicaciones del usuario
    @Get('ver')
    async ver(
        @Res() response,
        @Session() session,
    ){
        const consulta = {relations: ["usuario"],
            where:[
                {
                    usuario: session.usuario
                }
            ]
        };
        const publicaciones = await this._publicacionService.buscar(consulta);
        // Obtener el nombre del usuario
        console.log(publicaciones);
        response.render('publicaciones.ejs',{publicaciones_usuario:publicaciones,nombre:session})
    }

    // Ver las compras realizadas por el usuario
    @Get('compras')
    async compras(
        @Res() response,
        @Session() session,
    ){
        const consulta = {relations: ["publicacion"],
            where:[
                {
                    comprador: session.usuario
                }
            ]
        };
        // Buscamos las compras que ha hecho el usuario
        const compras = await this._compraService.buscar(consulta);
        console.log(compras);
            response.render(
                'compras.ejs',{
                    compras_usuario:compras,
                    nombre:session
                }
            )

    }

    // Registar publicacion
    @Post('registrar')
    @UseInterceptors(
        FilesInterceptor('files',6,{
            dest: 'publico/imagenes',
            fileFilter: (req, file, cb) => {
                file.filename = Date.now()+'-'+file.originalname;
                cb(null, true);
            },
        }
        )

    )
    uploadFile(
        @UploadedFiles() files
    ):string {
        return "Se han subido archivos"
    }

    @Get('registrar')
    registrar(
        @Res() response,
        @Session() session,
    ){
        return response.render('crear_publicacion.ejs',{session:session})
    }


}