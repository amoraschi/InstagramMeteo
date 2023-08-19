import { IgApiClient } from 'instagram-private-api'
import dotenv from 'dotenv'
import { generateChart } from './generateChart.js'
import { getUVIndex, traduceLunarPhase, firstCapital } from './utils.js'

dotenv.config()

async function postDaily () {
  console.log('Logging in')
  const ig = new IgApiClient()
  ig.state.generateDevice(process.env.USER)
  const auth = await ig.account.login(process.env.USER, process.env.PASS)
  console.log('Logged in')

  console.log('Fetching weather data')
  const weather = await fetchWeather()
  console.log('Fetched weather data')

  console.log('Generating chart')
  const chart = await generateChart(weather.hours)
  console.log('Generated chart')

  console.log('Posting photo')
  const dateString = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const captionString = `Previsión meteorológica de Sevilla para hoy ${firstCapital(dateString)}\n\n` +
    `🔼 ${weather.temperature.maxcs} ºC | 🔼 ${weather.temperature.mincs} ºC\n\n` +
    `🌅 ${weather.sun.rise} | 🌇 ${weather.sun.set}\n\n` +
    `🌙 ${traduceLunarPhase(weather.moon.phase)} ${weather.moon.illumination}%`
    
  await ig.publish.photo({
    file: chart,
    caption: captionString
  })

  console.log('Posted photo')
}

async function fetchWeather () {
  const res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.KEY}&q=${process.env.POS}`)
  const parsed = await res.json()

  const day = parsed.forecast.forecastday[0].day
  const current = parsed.current
  const astro = parsed.forecast.forecastday[0].astro
  const hour = parsed.forecast.forecastday[0].hour

  return {
    localtime: parsed.location.localtime_epoch,
    lastupdate: current.last_updated,
    date: parsed.forecast.forecastday[0].date,
    temperature: {
      maxcs: day.maxtemp_c,
      maxft: day.maxtemp_f,
      mincs: day.mintemp_c,
      minft: day.mintemp_f,
      currentcs: current.temp_c,
      currentft: current.temp_f
    },
    wind: {
      kph: current.wind_kph,
      mph: current.wind_mph,
      direction: current.wind_dir,
      degree: current.wind_degree
    },
    precipitation: {
      mm: current.precip_mm,
      in: current.precip_in
    },
    visibility: {
      km: current.vis_km,
      miles: current.vis_miles
    },
    humidity: current.humidity,
    uv: {
      index: current.uv,
      text: getUVIndex(current.uv)
    },
    condition: {
      text: current.condition.text,
      icon: current.condition.icon
    },
    sun: {
      rise: astro.sunrise,
      set: astro.sunset
    },
    moon: {
      phase: astro.moon_phase,
      illumination: astro.moon_illumination
    },
    hours: hour.map(h => {
      return {
        time: new Date(h.time).getHours(),
        tempcs: h.temp_c,
        tempft: h.temp_f,
        condition: {
          text: h.condition.text,
          icon: h.condition.icon
        },
        wind: {
          kph: h.wind_kph,
          mph: h.wind_mph
        },
        precipitation: {
          mm: h.precip_mm,
          in: h.precip_in
        },
        humidity: h.humidity,
        uv: h.uv
      }
    })
  }
}

postDaily()
