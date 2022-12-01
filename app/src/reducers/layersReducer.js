const layersString = 'Provincias,Obra_de_Comunicación,Obra_Portuaria,Otras_Edificaciones,Pais_Lim,Puente_Red_Vial_Puntos,Puntos_del_Terreno,Puntos_de_Alturas_Topograficas,Actividades_Agropecuarias,Actividades_Economicas,Complejo_de_Energia_Ene,Curso_de_Agua_Hid,Curvas_de_Nivel,Edificios_Ferroviarios,Edificio_de_Salud_IPS,Edificio_de_Seguridad_IPS,Edificio_Publico_IPS,Edif_Construcciones_Turisticas,Edif_Depor_y_Esparcimiento,Edif_Educacion,Edif_Religiosos,Ejido,Espejo_de_Agua_Hid,Estructuras_portuarias,Infraestructura_Aeroportuaria_Punto,Infraestructura_Hidro,Isla,Limite_Politico_Administrativo_Lim,Localidades,Líneas_de_Conducción_Ene,Marcas_y_Señales,Muro_Embalse,Red_ferroviaria,Red_Vial,Salvado_de_Obstaculo,Señalizaciones,Sue_congelado,Sue_consolidado,Sue_Costero,Sue_Hidromorfologico,Sue_No_Consolidado,Veg_Arborea,Veg_Arbustiva,Veg_Cultivos,veg_Hidrofila,Veg_Suelo_Desnudo,Vias_Secundarias'

export const availableLayers = layersString.split(',').map((layer) => {
  return {
    sourceName: layer,
    name: layer.replace(/_/g, ' ').replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase()).replace(/(Veg)/, 'Vegetación').replace(/(Sue)/, 'Suelo').replace(/(Lim)/, 'Limítrofe').replace(/(Edif)/, 'Edificios'),
    zIndex: layer.match(/(Puntos|Edif|Edificio|Edificios|Complejo|Infraestructura|Estructuras|Red|Salvado|Señalizaciones|Marcas|Vias|Obra|Actividades|Curvas)/) ? 1 : 0,
    visible: false
  }
}).sort((a, b) => a.name.localeCompare(b.name))

export const TOGGLE_LAYER = 'TOGGLE_LAYER'

export const CLEAR_ALL_LAYERS = 'CLEAR_ALL_LAYERS'

export const FILTER_LAYERS = 'FILTER_LAYERS'

export const layersReducer = (state = availableLayers, action) => {
  switch (action.type) {
    case TOGGLE_LAYER:
      return state.map((layer) => {
        if (layer.name === action.name) {
          return {
            ...layer,
            visible: !layer.visible
          }
        }
        return layer
      })
    case CLEAR_ALL_LAYERS:
      return state.map((layer) => {
        return {
          ...layer,
          visible: false
        }
      })
    default:
      return state
  }
}
