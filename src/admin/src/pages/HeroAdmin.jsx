// pages/HeroAdmin.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Alert,
    CircularProgress,
} from '@mui/material';
import { getHeroData, setHeroData, deleteHeroData } from '../services/heroService';
import heroImage from '../../../assets/hero.jpg';

const DEFAULT_HERO = {
    title: 'Discover Your Signature Scent',
    subtitle: 'Artisan fragrances crafted with rare ingredients to elevate your presence and leave an unforgettable impression.',
    imageUrl: heroImage, // fallback if no image
    ctaText: 'Shop Now',
    exploreText: 'Explore Collections',
    titleColor: '#C8A04D',
    subtitleColor: 'common.white',
    showTitle: true,
    showSubtitle: true,
    showButtons: true,
};

const HeroAdmin = () => {
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        imageUrl: '',
        ctaText: '',
        exploreText: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const data = await getHeroData();
                if (data) {
                    setFormData(data);
                } else {
                    setFormData(DEFAULT_HERO); // fallback to default
                }
            } catch (err) {
                setError('Failed to load hero data.');
                setFormData(DEFAULT_HERO);
            } finally {
                setLoading(false);
            }
        };

        fetchHero();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await setHeroData(formData);
            setSuccess('Hero section updated successfully!');
        } catch (err) {
            setError('Failed to save data.');
        } finally {
            setSaving(false);
        }
    };

    const handleResetToDefault = async () => {
        setDeleting(true);
        setError('');
        setSuccess('');
        try {
            await deleteHeroData();
            setFormData(DEFAULT_HERO);
            setSuccess('Reset to default content.');
        } catch (err) {
            setError('Failed to reset data.');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Typography variant="h4" gutterBottom align="center">
                Edit Hero Section
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Card sx={{ mb: 4, position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="500"
                    image={formData.imageUrl || DEFAULT_HERO.imageUrl}
                    alt="Preview"
                    sx={{ objectFit: 'cover', objectPosition: 'center' }}
                />
                <CardContent>
                    <Typography variant="h5" sx={{ color: '#C8A04D', mb: 1 }}>
                        {formData.title || DEFAULT_HERO.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'white', opacity: 0.85 }}>
                        {formData.subtitle || DEFAULT_HERO.subtitle}
                    </Typography>
                </CardContent>
            </Card>

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Main Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    margin="normal"
                    multiline
                    rows={3}
                    required
                />
                <TextField
                    fullWidth
                    label="Image URL"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    margin="normal"
                    helperText="Enter a public URL to an image (e.g., from Firebase Storage or CDN)"
                    required
                />
                <TextField
                    fullWidth
                    label="Shop Button Text"
                    name="ctaText"
                    value={formData.ctaText}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Explore Button Text"
                    name="exploreText"
                    value={formData.exploreText}
                    onChange={handleChange}
                    margin="normal"
                />

                <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={saving}
                        sx={{ flex: 1 }}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleResetToDefault}
                        disabled={deleting}
                        sx={{ flex: 1 }}
                    >
                        {deleting ? 'Resetting...' : 'Reset to Default'}
                    </Button>
                </Box>
                {/* Color Pickers */}
                <TextField
                    fullWidth
                    label="Title Color (hex)"
                    name="titleColor"
                    value={formData.titleColor}
                    onChange={handleChange}
                    margin="normal"
                    type="color"
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    fullWidth
                    label="Subtitle Color (hex)"
                    name="subtitleColor"
                    value={formData.subtitleColor}
                    onChange={handleChange}
                    margin="normal"
                    type="color"
                    InputLabelProps={{ shrink: true }}
                />

                {/* Toggle Switches */}
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                    Visibility
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, ml: 1 }}>
                    <Box>
                        <input
                            type="checkbox"
                            id="showTitle"
                            name="showTitle"
                            checked={formData.showTitle}
                            onChange={(e) => setFormData(prev => ({ ...prev, showTitle: e.target.checked }))}
                        />
                        <label htmlFor="showTitle"> Show Title</label>
                    </Box>

                    <Box>
                        <input
                            type="checkbox"
                            id="showSubtitle"
                            name="showSubtitle"
                            checked={formData.showSubtitle}
                            onChange={(e) => setFormData(prev => ({ ...prev, showSubtitle: e.target.checked }))}
                        />
                        <label htmlFor="showSubtitle"> Show Subtitle</label>
                    </Box>

                    <Box>
                        <input
                            type="checkbox"
                            id="showButtons"
                            name="showButtons"
                            checked={formData.showButtons}
                            onChange={(e) => setFormData(prev => ({ ...prev, showButtons: e.target.checked }))}
                        />
                        <label htmlFor="showButtons"> Show Buttons</label>
                    </Box>
                </Box>
            </form>
        </Container>
    );
};

export default HeroAdmin;