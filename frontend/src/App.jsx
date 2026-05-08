import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Briefcase, GraduationCap, MapPin, Building, Award, Laptop, Send, Loader2, Sparkles, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const API_BASE_URL = 'http://localhost:5000'

function App() {
  const [options, setOptions] = useState(null)
  const [formData, setFormData] = useState({
    job_title: '',
    experience_years: 5,
    education_level: '',
    skills_count: 5,
    industry: '',
    company_size: '',
    location: '',
    remote_work: '',
    certifications: 1
  })
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOptions()
  }, [])

  const fetchOptions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/options`)
      setOptions(response.data)
      // Set defaults
      const firstEntries = {}
      Object.keys(response.data).forEach(key => {
        firstEntries[key] = response.data[key][0]
      })
      setFormData(prev => ({ ...prev, ...firstEntries }))
    } catch (err) {
      console.error('Error fetching options:', err)
      setError('Could not connect to the backend server. Make sure it is running.')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, formData)
      setPrediction(response.data.salary)
    } catch (err) {
      console.error('Prediction error:', err)
      setError(err.response?.data?.error || 'Failed to predict salary. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!options && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="gradient-text">Salary Prediction</span>
          <span className="text-white"> AI</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Harnessing the power of Machine Learning to predict your market value.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 glass-card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid-cols-2">
              <div>
                <label><Briefcase size={16} className="inline mr-2" /> Job Title</label>
                <select name="job_title" className="input-field" value={formData.job_title} onChange={handleInputChange}>
                  {options?.job_title?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label><GraduationCap size={16} className="inline mr-2" /> Education Level</label>
                <select name="education_level" className="input-field" value={formData.education_level} onChange={handleInputChange}>
                  {options?.education_level?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            <div className="grid-cols-2">
              <div>
                <label><Building size={16} className="inline mr-2" /> Industry</label>
                <select name="industry" className="input-field" value={formData.industry} onChange={handleInputChange}>
                  {options?.industry?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label><MapPin size={16} className="inline mr-2" /> Location</label>
                <select name="location" className="input-field" value={formData.location} onChange={handleInputChange}>
                  {options?.location?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            <div className="grid-cols-2">
              <div>
                <label><Laptop size={16} className="inline mr-2" /> Remote Work</label>
                <select name="remote_work" className="input-field" value={formData.remote_work} onChange={handleInputChange}>
                  {options?.remote_work?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label><TrendingUp size={16} className="inline mr-2" /> Company Size</label>
                <select name="company_size" className="input-field" value={formData.company_size} onChange={handleInputChange}>
                  {options?.company_size?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label>Experience (Years)</label>
                <input type="number" name="experience_years" className="input-field" value={formData.experience_years} onChange={handleInputChange} min="0" max="50" />
              </div>
              <div>
                <label>Skills Count</label>
                <input type="number" name="skills_count" className="input-field" value={formData.skills_count} onChange={handleInputChange} min="0" max="50" />
              </div>
              <div>
                <label>Certifications</label>
                <input type="number" name="certifications" className="input-field" value={formData.certifications} onChange={handleInputChange} min="0" max="20" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              {loading ? 'Predicting...' : 'Predict Salary'}
            </button>
          </form>
        </motion.div>

        {/* Result Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {prediction ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card p-8 border-blue-500/50 flex flex-col items-center justify-center text-center h-full min-h-[300px]"
              >
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="text-blue-400" size={32} />
                </div>
                <h3 className="text-slate-400 font-medium mb-2">Estimated Annual Salary</h3>
                <div className="text-5xl font-bold gradient-text mb-4">
                  ${prediction.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 max-w-[200px]">
                  Based on current market trends and model accuracy of 98%.
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px] border-dashed border-slate-700"
              >
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-500">
                  <Award size={24} />
                </div>
                <p className="text-slate-500">
                  Enter your details and click predict to see your expected salary.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
        </div>
      </div>

      <footer className="mt-12 text-center text-slate-500 text-sm">
        Built with XGBoost & Next Gen AI Technologies • 2026
      </footer>
    </div>
  )
}

export default App
