import { useState, useEffect, useRef, useCallback } from 'react'

export default function Sidebar({ meta, onSearch, firstField, preload }) {
  const [ availableYears, setAvailableYears ] = useState([])
  const [ availableMakes, setAvailableMakes ] = useState([])
  const [ availableModels, setAvailableModels ] = useState([])
  const [ selectedZip, setSelectedZip ] = useState('90066')
  const [ selectedYear, setSelectedYear ] = useState()
  const [ selectedMake, setSelectedMake ] = useState()
  const [ selectedModel, setSelectedModel ] = useState()
  const [ hasPreloaded, setHasPreloaded ] = useState(false)
  
  const form = useRef(null)

  const handleSubmit = useCallback(e => {
    e?.preventDefault?.()
    const formData = new FormData(e.target)
    const formJson = Object.fromEntries(formData.entries())

    // notice we're copying trims from selectedModel, not from the one in the formJson which is just a string
    formJson.trims = selectedModel.trims
    onSearch(formJson)
  }, [onSearch, selectedModel])

  useEffect(() => {
    if (meta.length > 0) {
      setAvailableYears(meta)
    }
  }, [meta])

  useEffect(() => {
    if (preload && !hasPreloaded) {
      setSelectedZip(preload.zip)
      setSelectedYear(availableYears.find(year => year.name === preload.year))
    } else {
      setSelectedYear(availableYears.at(-1))
    }
  }, [preload, hasPreloaded, availableYears])

  useEffect(() => {
    if (selectedYear) {
      setAvailableMakes(selectedYear.makes)
      if (preload && !hasPreloaded) {
        setSelectedMake(selectedYear.makes.find(make => make.name === preload.make))
      } else {
        setSelectedMake(selectedYear.makes[0])
      }
    }
  }, [preload, hasPreloaded, selectedYear])

  useEffect(() => {
    if (selectedMake) {
      setAvailableModels(selectedMake.models)
      if (preload && !hasPreloaded) {
        setSelectedModel(selectedMake.models.find(model => model.name === preload.model))
      } else {
        setSelectedModel(selectedMake.models[0])
      }
    }
  }, [preload, hasPreloaded, selectedMake])

  useEffect(() => {
    if (preload && !hasPreloaded && selectedZip && selectedYear && selectedMake && selectedModel) {
      setHasPreloaded(true)
      handleSubmit({
        target: form.current,
      })
    }
  }, [preload, hasPreloaded, selectedZip, selectedYear, selectedMake, selectedModel, handleSubmit])

  return (
    <div className="bg-base-100 p-6 h-full z-50 overflow-y-auto">
      <form ref={form} onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">ZIP code</span>
            <span className="label-text-alt">(US only)</span>
          </label>
          <input ref={firstField} name="zip" type="number" placeholder="12345" className="input input-bordered" value={selectedZip} onChange={e => setSelectedZip(e.target.value.trim().slice(0, 5))} />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Year</span>
          </label>
          <select name="year" className="select select-bordered" required={true} value={selectedYear?.name} onChange={e => setSelectedYear(availableYears.find(year => year.name === e.target.value))}>
            {availableYears.map(({ name }) => <option value={name} key={name}>{name}</option>)}
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Make</span>
            <span className="label-text-alt">(more coming soon!)</span>
          </label>
          <select name="make" className="select select-bordered" required={true} value={selectedMake?.name} onChange={e => setSelectedMake(availableMakes.find(make => make.name === e.target.value))}>
            {availableMakes.map(({ name }) => <option value={name} key={name}>{name}</option>)}
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Model</span>
          </label>
          <select name="model" className="select select-bordered" required={true} value={selectedModel?.name} onChange={e => setSelectedModel(availableModels.find(model => model.name === e.target.value))}>
            {availableModels.map(({ name }) => <option value={name} key={name}>{name}</option>)}
          </select>
        </div>
        <div className="form-control pt-4">
          <button type="submit" className="btn btn-neutral">
            Search
          </button>
        </div>
      </form>
    </div>
  )
}